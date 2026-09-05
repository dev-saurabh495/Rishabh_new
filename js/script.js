/* =====================================================
   Rishabh Shukla — Portfolio
   Vanilla JS, organized into reusable init functions
   ===================================================== */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let lenisInstance = null;

  /* ---------------------------------------------------
     initLenis — smooth scrolling, wired to GSAP ticker
  --------------------------------------------------- */
  function initLenis() {
    if (prefersReduced || typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth-scroll on internal nav links
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -70 });
          }
        }
      });
    });

    return lenis;
  }

  /* ---------------------------------------------------
     Fallback smooth-scroll if Lenis / reduced motion
  --------------------------------------------------- */
  function initFallbackScroll() {
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
          }
        }
      });
    });
  }

  /* ---------------------------------------------------
     initNavbar — glass on scroll, shrink, active link
  --------------------------------------------------- */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('main section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link[data-nav]');

    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      let current = '';
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          current = sec.id;
        }
      });

      navLinkEls.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------
     initMobileMenu — hamburger + GSAP open/close
  --------------------------------------------------- */
  function initMobileMenu() {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    let open = false;

    function setOpen(state) {
      open = state;
      btn.setAttribute('aria-expanded', String(state));
      menu.setAttribute('aria-hidden', String(!state));

      if (window.gsap && !prefersReduced) {
        if (state) {
          gsap.set(menu, { visibility: 'visible', pointerEvents: 'auto' });
          gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
          gsap.fromTo(menu.querySelectorAll('a'),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, delay: 0.1, ease: 'power2.out' });
        } else {
          gsap.to(menu, {
            opacity: 0, duration: 0.3, ease: 'power2.in',
            onComplete: () => gsap.set(menu, { visibility: 'hidden', pointerEvents: 'none' })
          });
        }
      } else {
        menu.style.visibility = state ? 'visible' : 'hidden';
        menu.style.pointerEvents = state ? 'auto' : 'none';
        menu.style.opacity = state ? '1' : '0';
      }

      document.body.style.overflow = state ? 'hidden' : '';
    }

    btn.addEventListener('click', () => setOpen(!open));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  /* ---------------------------------------------------
     initHeroAnimations — one orchestrated entrance
  --------------------------------------------------- */
  function initHeroAnimations() {
    if (prefersReduced || !window.gsap) {
      document.querySelectorAll('[data-hero-item], [data-hero-line], [data-hero-portrait]').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero-heading .line', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.1)
      .to('[data-hero-item]', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.35)
      .fromTo('[data-hero-portrait]', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1 }, 0.3)
      .fromTo('.team-chip', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.9)
      .fromTo('.deco-ring', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.9 }, 0.5);
  }

  /* ---------------------------------------------------
     initScrollAnimations — section + card reveals
  --------------------------------------------------- */
  function initScrollAnimations() {
    if (prefersReduced || !window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal, [data-scale-reveal]').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 87%' }
      });
    });

    gsap.utils.toArray('[data-scale-reveal]').forEach((el) => {
      gsap.to(el, {
        opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // Timeline items progressive reveal, alternating slide direction
    gsap.utils.toArray('.timeline-item').forEach((item) => {
      const fromX = item.dataset.side === 'left' ? 40 : -40;
      gsap.fromTo(item, { opacity: 0, x: fromX }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 88%' }
      });
    });

    // Card grids stagger
    ['.ach-grid', '.pillar-grid', '.test-grid'].forEach((sel) => {
      const grid = document.querySelector(sel);
      if (!grid) return;
      gsap.to(grid.children, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: grid, start: 'top 85%' }
      });
      gsap.set(grid.children, { opacity: 0, y: 24 });
    });
  }

  /* ---------------------------------------------------
     initCounters — count-up numbers on view
  --------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.countTo, 10);
      if (prefersReduced || !window.gsap) {
        el.textContent = target;
        return;
      }
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.floor(obj.val); }
      });
    }

    if (window.ScrollTrigger) {
      counters.forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: () => animateCounter(el)
        });
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------------------------------------------------
     initParallax — hero glow, portrait, decorative
  --------------------------------------------------- */
  function initParallax() {
    if (prefersReduced || !window.gsap || !window.ScrollTrigger) return;

    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true
        }
      });
    });
  }

  /* ---------------------------------------------------
     Floating particles (decorative, hero only)
  --------------------------------------------------- */
  function initParticles() {
    const field = document.getElementById('particles');
    if (!field || prefersReduced) return;

    const count = window.innerWidth < 700 ? 12 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.opacity = (0.15 + Math.random() * 0.4).toFixed(2);
      field.appendChild(p);

      if (window.gsap) {
        gsap.to(p, {
          y: `+=${(Math.random() * 40 + 20) * (Math.random() > 0.5 ? 1 : -1)}`,
          x: `+=${(Math.random() * 30 + 10) * (Math.random() > 0.5 ? 1 : -1)}`,
          duration: 6 + Math.random() * 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    }
  }

  /* ---------------------------------------------------
     initGallery + initLightbox
  --------------------------------------------------- */
  function initGallery() {
    // Gallery reveal handled in initScrollAnimations via .reveal class.
    // This function wires up click-to-open behaviour.
    const items = document.querySelectorAll('.g-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    items.forEach((item) => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.img;
        lightboxImg.alt = item.querySelector('img')?.alt || 'Gallery photo';
        openLightbox(lightbox);
      });
    });
  }

  function openLightbox(lightbox) {
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(lightbox) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightboxClose');

    closeBtn.addEventListener('click', () => closeLightbox(lightbox));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox(lightbox);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(lightbox);
    });
  }

  /* ---------------------------------------------------
     initScrollProgress — thin gold bar at top
  --------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------------
     initBackToTop
  --------------------------------------------------- */
  function initBackToTop() {
    const btnEl = document.getElementById('backToTop');

    function onScroll() {
      btnEl.classList.toggle('visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btnEl.addEventListener('click', () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  }

  /* ---------------------------------------------------
     Custom cursor (desktop / fine-pointer only)
  --------------------------------------------------- */
  function initCustomCursor() {
    if (!isFinePointer || prefersReduced) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('a, button, .g-item').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------------------------------------------------
     Magnetic button effect (desktop only)
  --------------------------------------------------- */
  function initMagneticButtons() {
    if (!isFinePointer || prefersReduced) return;

    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.4}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------------------------------------------------
     Contact form (static — visual confirmation only)
  --------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('formMsg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      msg.textContent = 'Thanks — your message has been noted. Rishabh will get back to you soon.';
      form.reset();
    });
  }

  /* ---------------------------------------------------
     Boot
  --------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initCustomCursor();
    initMagneticButtons();
    initParticles();
    initGallery();
    initLightbox();
    initBackToTop();
    initContactForm();

    lenisInstance = initLenis();
    if (!lenisInstance) initFallbackScroll();

    initHeroAnimations();
    initScrollAnimations();
    initCounters();
    initParallax();
  });
})();
