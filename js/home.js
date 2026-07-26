// ============================================================
// HOME PAGE — SPECIFIC JAVASCRIPT
// ============================================================

(function() {
  'use strict';

  // ── HERO PARTICLES ─────────────────────────────────────────
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = window.innerWidth > 768 ? 30 : 15;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 5;
      const isGold = Math.random() > 0.6;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: 0;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        background: ${isGold ? '#D4A14C' : '#C72C2C'};
        opacity: 0;
      `;

      container.appendChild(p);
    }
  }

  createParticles();

  // ── GALLERY CAROUSEL ───────────────────────────────────────
  const track     = document.getElementById('galleryTrack');
  const prevBtn   = document.getElementById('carouselPrev');
  const nextBtn   = document.getElementById('carouselNext');
  const dotsWrap  = document.getElementById('carouselDots');

  if (track) {
    const slides     = track.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;
    let current      = 0;
    let autoInterval;
    let slidesPerView = getSlidesPerView();

    function getSlidesPerView() {
      if (window.innerWidth > 900) return 3;
      if (window.innerWidth > 600) return 2;
      return 1;
    }

    // Create dots
    if (dotsWrap) {
      const dotCount = Math.ceil(totalSlides / slidesPerView);
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(idx) {
      const maxIdx = Math.ceil(totalSlides / slidesPerView) - 1;
      current = Math.max(0, Math.min(idx, maxIdx));

      const slideWidth = slides[0].offsetWidth + 18; // width + margin
      track.style.transform = `translateX(-${current * slidesPerView * slideWidth}px)`;

      // Update dots
      dotsWrap && dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function next() {
      const maxIdx = Math.ceil(totalSlides / slidesPerView) - 1;
      goTo(current >= maxIdx ? 0 : current + 1);
    }

    function prev() {
      const maxIdx = Math.ceil(totalSlides / slidesPerView) - 1;
      goTo(current <= 0 ? maxIdx : current - 1);
    }

    prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    function startAuto() {
      autoInterval = setInterval(next, 4000);
    }

    function resetAuto() {
      clearInterval(autoInterval);
      startAuto();
    }

    startAuto();

    // Touch support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : prev();
        resetAuto();
      }
    });

    // Responsive
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        slidesPerView = getSlidesPerView();
        goTo(0);
        if (dotsWrap) {
          dotsWrap.innerHTML = '';
          const dotCount = Math.ceil(totalSlides / slidesPerView);
          for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
          }
        }
      }, 200);
    });
  }

  // ── LEADERBOARD COUNTER ANIMATION ─────────────────────────
  function animateCounters() {
    const kills = document.querySelectorAll('.lb-kills');
    kills.forEach(el => {
      const target = parseInt(el.textContent);
      if (isNaN(target)) return;
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }

  const lbSection = document.getElementById('leaderboardTeaser');
  if (lbSection) {
    const lbObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          lbObserver.unobserve(lbSection);
        }
      });
    }, { threshold: 0.3 });
    lbObserver.observe(lbSection);
  }

  // ── HERO PARALLAX ─────────────────────────────────────────
  const heroEl = document.querySelector('.hero-jungle-layer');
  if (heroEl && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroEl.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }

  // ── DISCORD STATS COUNTER ──────────────────────────────────
  function animateDiscordStats() {
    const targets = [
      { el: document.querySelector('.discord-stat:nth-child(1) .discord-stat-num'), target: 2400, suffix: '+' },
      { el: document.querySelector('.discord-stat:nth-child(3) .discord-stat-num'), target: 340, suffix: '+' },
    ];

    targets.forEach(({ el, target, suffix }) => {
      if (!el) return;
      let current = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }

  const discordSection = document.getElementById('discordCta');
  if (discordSection) {
    const discordObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateDiscordStats();
          discordObs.unobserve(discordSection);
        }
      });
    }, { threshold: 0.4 });
    discordObs.observe(discordSection);
  }

})();
