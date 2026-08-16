/**
 * Monkey Playzone — Cloudflare Worker
 *
 * Responsibilities:
 *  1. Proxy FiveM server status API at /api/server-status
 *     (avoids CORS issues with direct browser → fivem API calls)
 *  2. Forward all other requests to Workers Assets
 *  3. Apply cache-control headers per asset type
 *  4. Inject security headers on every response
 *  5. Return the custom 404 page for unmatched routes
 */

const JOIN_CODE = 'a4zmokz';
const FIVEM_API = `https://frontend.cfx-services.net/api/servers/single/${JOIN_CODE}`;

// ─── Cache-control policies ───────────────────────────────────────────────────
const CACHE_POLICIES = {
  immutable: "public, max-age=31536000, immutable",
  scripts:   "public, max-age=2592000",
  html:      "public, max-age=3600, must-revalidate",
  default:   "public, max-age=86400",
};

// ─── Security headers added to every response ─────────────────────────────────
const SECURITY_HEADERS = {
  "X-Frame-Options":        "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection":       "1; mode=block",
  "Referrer-Policy":        "strict-origin-when-cross-origin",
  "Permissions-Policy":     "camera=(), microphone=(), geolocation=()",
};

// ─── Helper: pick cache policy based on URL path ──────────────────────────────
function getCacheControl(pathname) {
  if (pathname.startsWith("/assets/")) return CACHE_POLICIES.immutable;
  if (pathname.startsWith("/css/"))    return CACHE_POLICIES.scripts;
  if (pathname.startsWith("/js/"))     return CACHE_POLICIES.scripts;
  const ext = pathname.split(".").pop().toLowerCase();
  if (["png","jpg","jpeg","webp","svg","ico","gif","woff","woff2","ttf"].includes(ext))
    return CACHE_POLICIES.immutable;
  if (["txt","xml","json"].includes(ext)) return CACHE_POLICIES.default;
  return CACHE_POLICIES.html;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url      = new URL(request.url);
    const pathname = url.pathname;

    // ── API: FiveM server status proxy ───────────────────────────────────────
    // Called by main.js as /api/server-status
    // Worker fetches from FiveM server-side → no CORS issues for the browser
    if (pathname === '/api/server-status') {
      try {
        const fivemRes = await fetch(FIVEM_API, {
          headers: { 'User-Agent': 'MonkeyPlayzone-StatusBot/1.0' },
          cf: { cacheTtl: 30, cacheEverything: true }, // cache FiveM response 30s in CF edge
        });

        if (!fivemRes.ok) {
          return new Response(JSON.stringify({ online: false }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        const data = await fivemRes.json();
        const payload = {
          online:     true,
          players:    data?.Data?.clients    ?? 0,
          maxPlayers: data?.Data?.sv_maxclients ?? 0,
          hostname:   data?.Data?.hostname   ?? '',
        };

        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=30, s-maxage=30',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch {
        return new Response(JSON.stringify({ online: false }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // ── Static assets via Workers Assets ─────────────────────────────────────
    let response = await env.ASSETS.fetch(request);

    // ── Handle 404 with custom page ───────────────────────────────────────────
    if (response.status === 404) {
      const notFoundReq = new Request(new URL("/404.html", url.origin).href, request);
      const notFoundRes = await env.ASSETS.fetch(notFoundReq);
      const body = await notFoundRes.arrayBuffer();
      const headers = new Headers(notFoundRes.headers);
      headers.set("Cache-Control", "no-store");
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
      return new Response(body, { status: 404, headers });
    }

    // ── Apply cache-control + security headers ────────────────────────────────
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", getCacheControl(pathname));
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);

    return new Response(response.body, {
      status:     response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
