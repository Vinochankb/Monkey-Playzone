import re

with open("js/main.js", "r", encoding="utf-8") as f:
    content = f.read()

# The incorrect part starts from: // ============================================================
# FIVEM SERVER STATUS FETCHER

if "// FIVEM SERVER STATUS FETCHER" in content:
    content = content.split('// FIVEM SERVER STATUS FETCHER')[0]
    content = content.rstrip() + "\n"

# Now append the correct JS block
js_to_add = """
// ============================================================
// FIVEM SERVER STATUS FETCHER
// ============================================================
(function() {
  const JOIN_CODE = 'xllrkdx';
  const API_URL = `https://servers-frontend.fivem.net/api/servers/single/${JOIN_CODE}`;
  
  const playerCountEl = document.getElementById('playerCount');
  const serverPingEl = document.getElementById('serverPing');
  const statusEl = document.querySelector('.status-value.online');

  async function fetchServerStatus() {
    if (!playerCountEl || !serverPingEl || !statusEl) return;
    
    try {
      const start = Date.now();
      const response = await fetch(API_URL);
      const ping = Date.now() - start;

      if (response.ok) {
        const data = await response.json();
        const players = data.Data.clients;
        const maxPlayers = data.Data.sv_maxclients;
        
        playerCountEl.textContent = `${players} / ${maxPlayers}`;
        serverPingEl.textContent = `${ping}ms`;
        
        statusEl.innerHTML = '<span class="pulse-dot sm"></span>ONLINE';
        statusEl.style.color = '#2ecc71';
      } else {
        throw new Error('Server offline or API error');
      }
    } catch (error) {
      playerCountEl.textContent = `0 / 0`;
      serverPingEl.textContent = `---`;
      
      statusEl.innerHTML = '<span class="pulse-dot sm" style="background:#e74c3c; box-shadow:0 0 8px #e74c3c;"></span>OFFLINE';
      statusEl.style.color = '#e74c3c';
    }
  }

  fetchServerStatus();
  setInterval(fetchServerStatus, 30000);
})();
"""

content += js_to_add

with open("js/main.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed main.js")
