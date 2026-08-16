// ============================================================
// MONKEY PLAYZONE — MAIN JAVASCRIPT
// ============================================================

(function() {
  'use strict';

  // ── AUTO COPYRIGHT YEAR ────────────────────────────────────
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = currentYear;
  });

  // ── NAVBAR SCROLL (for .navbar style pages) ────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── HAMBURGER MENU (.navbar style — gallery, faq) ──────────
  const hamburger     = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileMenuOverlay');
  const mobileClose   = document.getElementById('mobileMenuClose');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeNavbarMenu);
    }

    mobileOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeNavbarMenu);
    });
  }

  function closeNavbarMenu() {
    hamburger && hamburger.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── TOP-NAV HAMBURGER (.top-nav style — team, rules, arena, index) ──
  const topNavHamburger = document.getElementById('topNavHamburger');
  const topNavOverlay   = document.getElementById('mobileMenuOverlay');
  const topNavClose     = document.getElementById('mobileMenuClose');

  if (topNavHamburger && topNavOverlay) {
    topNavHamburger.addEventListener('click', () => {
      topNavHamburger.classList.toggle('open');
      topNavOverlay.classList.toggle('open');
      document.body.style.overflow = topNavOverlay.classList.contains('open') ? 'hidden' : '';
    });

    if (topNavClose) {
      topNavClose.addEventListener('click', closeTopNav);
    }

    topNavOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeTopNav);
    });
  }

  function closeTopNav() {
    topNavHamburger && topNavHamburger.classList.remove('open');
    topNavOverlay && topNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── COPY SERVER IP ─────────────────────────────────────────
  const copyIpEl = document.getElementById('copyIp');
  if (copyIpEl) {
    copyIpEl.addEventListener('click', () => {
      navigator.clipboard.writeText('cfx.re/join/a4zmokz').then(() => {
        const orig = copyIpEl.textContent;
        copyIpEl.textContent = '✓ COPIED!';
        copyIpEl.style.color = '#2ECC71';
        setTimeout(() => {
          copyIpEl.textContent = orig;
          copyIpEl.style.color = '';
        }, 2000);
      });
    });
  }

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
      observer.observe(el);
    });
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isHomeLink = href === '/' || href === 'index.html';
    const isHomePath = currentPath === 'index.html' || currentPath === '';
    
    if (href === currentPath || (isHomeLink && isHomePath)) {
      link.classList.add('active');
    } else if (href && !href.startsWith('#')) {
      link.classList.remove('active');
    }
  });

  // ── FAQ ACCORDION ──────────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── GALLERY FILTER BUTTONS ──────────────────────────────────
  document.querySelectorAll('.lb-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── BUTTON GLITCH EFFECT ───────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.animation = 'none';
      void btn.offsetWidth; // reflow
      btn.style.animation = 'glitch 0.4s ease';
    });
    btn.addEventListener('animationend', () => {
      btn.style.animation = '';
    });
  });

  // ── STAGGER CARD ANIMATIONS ────────────────────────────────
  const staggerGroups = document.querySelectorAll('.features-grid, .team-grid, .store-grid');
  staggerGroups.forEach(grid => {
    const cards = grid.children;
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(cards).forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 100);
          });
          cardObserver.unobserve(grid);
        }
      });
    }, { threshold: 0.1 });

    Array.from(cards).forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    cardObserver.observe(grid);
  });

  // ── ACTIVE NAV HIGHLIGHT ON SCROLL (index.html only) ───────
  if (currentPath === 'index.html' || currentPath === '') {
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.top-nav-links a[href*=' + sectionId + ']');

        if (navLink) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.classList.add('active');
          } else {
            navLink.classList.remove('active');
          }
        }
      });
    }, { passive: true });
  }

  // ── COMING SOON BLUR ON CLICK FOR GALLERY ─────────────────
  document.querySelectorAll('.gallery-grid-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.add('coming-soon');
    });
  });

})();

// ============================================================
// FIVEM SERVER STATUS FETCHER
// ============================================================
(function() {
  // Calls our own Worker proxy → Worker fetches from FiveM server-side
  // This avoids CORS errors that occur when the browser calls FiveM directly
  const STATUS_API = '/api/server-status';

  const playerCountEl = document.getElementById('playerCount');
  const serverPingEl  = document.getElementById('serverPing');
  const statusEl      = document.querySelector('.status-value.online');

  async function fetchServerStatus() {
    if (!playerCountEl || !serverPingEl || !statusEl) return;

    try {
      const start    = Date.now();
      const response = await fetch(STATUS_API);
      const ping     = Date.now() - start;
      const data     = await response.json();

      if (data.online) {
        playerCountEl.textContent = `${data.players} / ${data.maxPlayers}`;
        serverPingEl.textContent  = `${ping}ms`;
        statusEl.innerHTML = '<span class="pulse-dot sm"></span>ONLINE';
        statusEl.style.color = '#2ecc71';
      } else {
        throw new Error('offline');
      }
    } catch {
      playerCountEl.textContent = '0 / 0';
      serverPingEl.textContent  = '---';
      statusEl.innerHTML = '<span class="pulse-dot sm" style="background:#e74c3c; box-shadow:0 0 8px #e74c3c;"></span>OFFLINE';
      statusEl.style.color = '#e74c3c';
    }
  }

  fetchServerStatus();
  setInterval(fetchServerStatus, 30000);
})();
