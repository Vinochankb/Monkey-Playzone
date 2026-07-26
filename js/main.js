// ============================================================
// MONKEY PLAYZONE — MAIN JAVASCRIPT
// ============================================================

(function() {
  'use strict';

  // ── NAVBAR SCROLL ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── HAMBURGER MENU ─────────────────────────────────────────
  const hamburger      = document.getElementById('hamburger');
  const mobileOverlay  = document.getElementById('mobileMenuOverlay');
  const mobileClose    = document.getElementById('mobileMenuClose');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    mobileOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  }

  function closeMenu() {
    hamburger && hamburger.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── COPY SERVER IP ─────────────────────────────────────────
  const copyIpEl = document.getElementById('copyIp');
  if (copyIpEl) {
    copyIpEl.addEventListener('click', () => {
      navigator.clipboard.writeText('cfx.re/join/mpz1').then(() => {
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
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
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



})();

// ============================================================

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
