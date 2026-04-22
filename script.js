/* ═══════════════════════════════════════════════════════════
   VALIN REMODELING — PREMIUM MOTION SYSTEM
   Scroll-driven hero transformation, parallax & micro-animations
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     CONFIGURATION
     ───────────────────────────────────────────── */
  const CONFIG = {
    parallax: {
      image: 0.015,
      cards: 0.025,
      headline: 0.008,
    },
    lerp: 0.06,
    scroll: {
      // Scroll ranges (in px from top) for hero transformation
      heroFadeStart: 0,     // Start immediately
      heroFadeEnd: 150,    // Fade quickly as it leaves
      headlineStart: 0,
      headlineEnd: 200,
      containerStart: 0,
      containerEnd: 300,
      cardsStart: 0,
      cardsEnd: 200,
      copyFadeStart: 0,
      copyFadeEnd: 150,
      scrollHintEnd: 80,
    },
  };

  /* ─────────────────────────────────────────────
     STATE
     ───────────────────────────────────────────── */
  const state = {
    mouse: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    isMouseActive: false,
    scrollY: 0,
    lastScrollY: 0,
    ticking: false,
    rafId: null,
    isHeroVisible: true,
  };

  /* ─────────────────────────────────────────────
     DOM CACHE
     ───────────────────────────────────────────── */
  const el = {};

  function cacheElements() {
    // Hero elements
    el.hero = document.getElementById('hero');
    el.heroContainer = document.getElementById('heroContainer');
    el.heroImage = document.getElementById('heroImage');
    el.heroOverlay = document.getElementById('heroOverlay');
    el.heroNav = document.getElementById('heroNav');
    el.heroHeadlineWrap = document.getElementById('heroHeadlineWrap');
    el.heroHeadline = document.getElementById('heroHeadline');
    el.heroMain = document.getElementById('heroMain');
    el.heroSecondary = document.getElementById('heroSecondary');
    el.heroCopy = document.getElementById('heroCopy');
    el.heroCards = document.getElementById('heroCards');
    el.heroCardPreview = document.getElementById('heroCardPreview');
    el.heroCardStats = document.getElementById('heroCardStats');
    el.heroBottomBar = document.getElementById('heroBottomBar');
    el.heroScrollHint = document.getElementById('heroScrollHint');

    // About section elements
    el.about = document.getElementById('about');
    el.aboutLineAccent = document.getElementById('aboutLineAccent');
    el.aboutLabel = document.getElementById('aboutLabel');
    el.aboutContent = document.getElementById('aboutContent');
    el.aboutMetrics = document.getElementById('aboutMetrics');
    el.aboutMetric1 = document.getElementById('aboutMetric1');
    el.aboutMetric2 = document.getElementById('aboutMetric2');
    el.aboutMetric3 = document.getElementById('aboutMetric3');
    el.aboutMaterials = document.getElementById('aboutMaterials');
    el.aboutHeading = document.getElementById('aboutHeading');
    el.aboutBody = document.getElementById('aboutBody');
    el.aboutCta = document.getElementById('aboutCta');
  }

  /* ─────────────────────────────────────────────
     UTILITY FUNCTIONS
     ───────────────────────────────────────────── */

  /** Smooth linear interpolation */
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  /** Clamp value between min and max */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /** Map a value from one range to another */
  function mapRange(value, inMin, inMax, outMin, outMax) {
    const progress = clamp((value - inMin) / (inMax - inMin), 0, 1);
    return outMin + progress * (outMax - outMin);
  }

  /** Ease-out cubic for smooth deceleration */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /** Ease-in-out smooth for cinematic feel */
  function easeInOutSmooth(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }


  /* ═══════════════════════════════════════════════════
     SCROLL-DRIVEN HERO TRANSFORMATION
     ═══════════════════════════════════════════════════ */

  function handleScroll() {
    state.scrollY = window.scrollY || window.pageYOffset;

    if (!state.ticking) {
      requestAnimationFrame(() => {
        updateScrollTransformations();
        state.ticking = false;
      });
      state.ticking = true;
    }
  }

  function updateScrollTransformations() {
    const sy = state.scrollY;
    const cfg = CONFIG.scroll;

    // Skip hero scroll transformations on mobile to preserve CSS centering
    const isMobile = window.innerWidth <= 768;

    // ── 1. SCROLL HINT — fade out fast ──
    if (el.heroScrollHint) {
      const hintOpacity = mapRange(sy, 0, cfg.scrollHintEnd, 1, 0);
      el.heroScrollHint.style.opacity = hintOpacity;
    }

    // ── 2. OVERSIZED HEADLINE TRANSFORMATION ──
    // Main headline: moves up, scales down subtly, fades
    if (el.heroMain) {
      const headProgress = clamp((sy - cfg.headlineStart) / (cfg.headlineEnd - cfg.headlineStart), 0, 1);
      const easedHead = easeOutCubic(headProgress);

      const headTransY = easedHead * -80;          // moves up 80px
      const headScale = 1 - (easedHead * 0.08);    // scales to 0.92
      const headOpacity = 1 - (easedHead * 0.95);  // fades to 0.05

      el.heroMain.style.transform = `translateY(${headTransY}px) scale(${headScale})`;
      el.heroMain.style.opacity = headOpacity;
    }

    // Secondary headline: delayed, softer transformation
    if (el.heroSecondary) {
      const secStart = cfg.headlineStart + 60;
      const secProgress = clamp((sy - secStart) / (cfg.headlineEnd - secStart), 0, 1);
      const easedSec = easeOutCubic(secProgress);

      const secTransY = easedSec * -50;
      const secOpacity = 0.75 - (easedSec * 0.75);

      el.heroSecondary.style.transform = `translateY(${secTransY}px)`;
      el.heroSecondary.style.opacity = Math.max(0, secOpacity);
    }

    // ── 3. SUPPORTING COPY — fades out slowly ──
    if (el.heroCopy && !isMobile) {
      const copyOpacity = mapRange(sy, 150, 600, 1, 0);
      const copyTransY = mapRange(sy, 150, 600, 0, -40);

      el.heroCopy.style.opacity = Math.max(0, copyOpacity);
      el.heroCopy.style.transform = `translateY(${copyTransY}px)`;
    }

    // ── 4. HERO CONTAINER — force flat, no rounding ──
    if (el.heroContainer) {
      el.heroContainer.style.borderRadius = '0px';
      el.heroContainer.style.transform = 'scale(1)';
    }

    // ── 5. IMAGE — overlay darkens, stabilizes ──
    if (el.heroOverlay) {
      // Increase overlay darkness as we scroll to create depth transition
      const overlayProgress = clamp(sy / cfg.heroFadeEnd, 0, 1);
      const overlayOpacity = 1 + (overlayProgress * 0.4);  // increases from 1 to 1.4

      el.heroOverlay.style.opacity = overlayOpacity;
    }

    // ── 6. FLOATING CARDS — fade out slowly ──
    if (el.heroCards && !isMobile) {
      const cardsOpacity = mapRange(sy, 100, 500, 1, 0);
      const cardsTransY = mapRange(sy, 100, 500, 0, -60);

      el.heroCards.style.transform = `translateY(${cardsTransY}px)`;
      el.heroCards.style.opacity = Math.max(0, cardsOpacity);
      if (cardsOpacity <= 0) el.heroCards.style.pointerEvents = 'none';
      else el.heroCards.style.pointerEvents = '';
    }

    // ── 7. BOTTOM BAR — fades out gradually ──
    if (el.heroBottomBar) {
      const barOpacity = mapRange(sy, 50, 250, 1, 0);
      el.heroBottomBar.style.opacity = Math.max(0, barOpacity);
      if (barOpacity <= 0) el.heroBottomBar.style.pointerEvents = 'none';
    }

    // ── 7b. NAV — add glass background on scroll ──
    if (el.heroNav) {
      if (sy > 100) {
        el.heroNav.classList.add('hero__nav--scrolled');
      } else {
        el.heroNav.classList.remove('hero__nav--scrolled');
      }
      // Keep nav always visible (opacity controlled by CSS animation only)
      el.heroNav.style.opacity = '';
    }

    // ── 8. REDUCE PARALLAX intensity while scrolling ──
    // The deeper we scroll, the less mouse parallax applies
    const parallaxDamp = 1 - clamp(sy / 400, 0, 0.9);
    state.parallaxDamping = parallaxDamp;

    state.lastScrollY = sy;
  }


  /* ═══════════════════════════════════════════════════
     ABOUT SECTION — INTERSECTION-BASED REVEAL
     ═══════════════════════════════════════════════════ */

  function setupAboutObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      revealAboutElements();
      return;
    }

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    };

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAboutElements();
          aboutObserver.disconnect();
        }
      });
    }, observerOptions);

    if (el.about) {
      aboutObserver.observe(el.about);
    }
  }

  function revealAboutElements() {
    // Staggered reveal sequence
    const staggerDelay = 150; // ms between each element

    // 1. Line accent
    setTimeout(() => {
      if (el.aboutLineAccent) el.aboutLineAccent.classList.add('is-visible');
    }, 0);

    // 2. Section label
    setTimeout(() => {
      if (el.aboutLabel) el.aboutLabel.classList.add('is-visible');
    }, staggerDelay * 1);

    // 3. Content (heading + body + CTA)
    setTimeout(() => {
      if (el.aboutContent) el.aboutContent.classList.add('is-visible');
    }, staggerDelay * 2);

    // 4. Metrics — staggered individually
    setTimeout(() => {
      if (el.aboutMetric1) {
        el.aboutMetric1.style.transitionDelay = '0ms';
        el.aboutMetric1.classList.add('is-visible');
        animateMetricBar(el.aboutMetric1);
        animateMetricNumber(el.aboutMetric1);
      }
    }, staggerDelay * 3);

    setTimeout(() => {
      if (el.aboutMetric2) {
        el.aboutMetric2.style.transitionDelay = '0ms';
        el.aboutMetric2.classList.add('is-visible');
        animateMetricBar(el.aboutMetric2);
        animateMetricNumber(el.aboutMetric2);
      }
    }, staggerDelay * 4.5);

    setTimeout(() => {
      if (el.aboutMetric3) {
        el.aboutMetric3.style.transitionDelay = '0ms';
        el.aboutMetric3.classList.add('is-visible');
        animateMetricBar(el.aboutMetric3);
        animateMetricNumber(el.aboutMetric3);
      }
    }, staggerDelay * 6);

    // 5. Materials strip — last
    setTimeout(() => {
      if (el.aboutMaterials) el.aboutMaterials.classList.add('is-visible');
    }, staggerDelay * 7.5);
  }

  function animateMetricBar(metricEl) {
    const barFill = metricEl.querySelector('.about__metric-bar-fill');
    if (!barFill) return;

    const targetWidth = barFill.getAttribute('data-width');
    if (targetWidth) {
      // Slight delay for the bar to feel sequential after number
      setTimeout(() => {
        barFill.style.width = targetWidth + '%';
      }, 300);
    }
  }

  function animateMetricNumber(metricEl) {
    const numberEl = metricEl.querySelector('.about__metric-number');
    if (!numberEl) return;

    const target = parseInt(numberEl.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      const current = Math.round(eased * target);

      numberEl.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }


  /* ═══════════════════════════════════════════════════
     MOUSE PARALLAX (existing hero effect)
     ═══════════════════════════════════════════════════ */

  function handleMouseMove(e) {
    if (!el.hero) return;

    const rect = el.hero.getBoundingClientRect();
    state.target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    state.target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (!state.isMouseActive) {
      state.isMouseActive = true;
      startMouseAnimation();
    }
  }

  function handleMouseLeave() {
    state.target.x = 0;
    state.target.y = 0;
  }

  function animateMouse() {
    state.current.x = lerp(state.current.x, state.target.x, CONFIG.lerp);
    state.current.y = lerp(state.current.y, state.target.y, CONFIG.lerp);

    const cx = state.current.x;
    const cy = state.current.y;
    const damping = state.parallaxDamping !== undefined ? state.parallaxDamping : 1;

    // Apply parallax to hero image
    if (el.heroImage && damping > 0.05) {
      const imgX = cx * CONFIG.parallax.image * 100 * damping;
      const imgY = cy * CONFIG.parallax.image * 100 * damping;
      el.heroImage.style.transform =
        `translate(${imgX}px, ${imgY}px) scale(${1.02 + Math.abs(cx) * 0.003 * damping})`;
    }

    // Apply parallax to floating cards
    if (el.heroCardPreview && damping > 0.05) {
      const cardX = cx * CONFIG.parallax.cards * -80 * damping;
      const cardY = cy * CONFIG.parallax.cards * -60 * damping;
      // Don't override scroll transforms — let scroll handler manage opacity/Y
      el.heroCardPreview.style.marginLeft = `${cardX}px`;
      el.heroCardPreview.style.marginTop = `${cardY}px`;
    }

    if (el.heroCardStats && damping > 0.05) {
      const statX = cx * CONFIG.parallax.cards * -60 * damping;
      const statY = cy * CONFIG.parallax.cards * -80 * damping;
      el.heroCardStats.style.marginLeft = `${statX}px`;
      el.heroCardStats.style.marginTop = `${statY}px`;
    }

    // Apply subtle parallax to headline
    if (el.heroHeadline && damping > 0.05) {
      const headX = cx * CONFIG.parallax.headline * 50 * damping;
      el.heroHeadline.style.marginLeft = `${headX}px`;
    }

    const deltaX = Math.abs(state.target.x - state.current.x);
    const deltaY = Math.abs(state.target.y - state.current.y);

    if (deltaX > 0.001 || deltaY > 0.001) {
      state.rafId = requestAnimationFrame(animateMouse);
    } else {
      state.isMouseActive = false;
    }
  }

  function startMouseAnimation() {
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = requestAnimationFrame(animateMouse);
  }


  /* ═══════════════════════════════════════════════════
     HERO STAT COUNTER ANIMATION (initial load)
     ═══════════════════════════════════════════════════ */

  function animateHeroCounters() {
    const statNumbers = document.querySelectorAll('.hero__stat-number');

    statNumbers.forEach((numEl) => {
      const text = numEl.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1], 10);
      const plus = numEl.querySelector('.hero__stat-plus');
      const duration = 2200;
      const startTime = performance.now();

      numEl.textContent = '0';
      if (plus) numEl.appendChild(plus);

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(easedProgress * target);

        if (plus) {
          numEl.textContent = currentValue.toString();
          numEl.appendChild(plus);
        } else {
          numEl.textContent = currentValue.toString();
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      setTimeout(() => {
        requestAnimationFrame(updateCounter);
      }, 2400);
    });
  }


  /* ═══════════════════════════════════════════════════
     VISIBILITY OBSERVER (hero parallax performance)
     ═══════════════════════════════════════════════════ */

  function setupVisibilityObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            state.isHeroVisible = true;
            el.hero.addEventListener('mousemove', handleMouseMove, { passive: true });
            el.hero.addEventListener('mouseleave', handleMouseLeave, { passive: true });
          } else {
            state.isHeroVisible = false;
            el.hero.removeEventListener('mousemove', handleMouseMove);
            el.hero.removeEventListener('mouseleave', handleMouseLeave);
            state.target.x = 0;
            state.target.y = 0;
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el.hero);
  }


  /* ═══════════════════════════════════════════════════
     BUTTON & CARD MICRO-INTERACTIONS
     ═══════════════════════════════════════════════════ */

  function setupButtonInteractions() {
    const buttons = document.querySelectorAll('.hero__btn, .hero__nav-cta, .about__cta');

    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      });
    });
  }

  function setupCardTilt() {
    const cards = document.querySelectorAll('.hero__card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
          perspective(600px)
          rotateX(${-y * 4}deg)
          rotateY(${x * 4}deg)
          translateY(-3px)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.15s ease-out';
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════════════ */

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════ */

  function init() {
    cacheElements();

    if (!el.hero) return;

    // Scroll system
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load in case page is already scrolled
    handleScroll();

    // Mouse parallax
    setupVisibilityObserver();

    // Hero counters
    animateHeroCounters();

    // About section reveal
    setupAboutObserver();

    // Micro-interactions
    setupButtonInteractions();
    setupSmoothScroll();

    // Delay card tilt to after entrance animation
    setTimeout(() => {
      setupCardTilt();
    }, 2800);

    // Typing effect for sections 2 and 4
    setupTypingEffect();

    // Scroll-controlled video in Section 5
    setupScrollVideo();

    // Catalog Video Control
    setupCatalogVideo();


  }



  /* ═══════════════════════════════════════════════════
     CATALOG VIDEO CONTROLS
     ═══════════════════════════════════════════════════ */

  function setupCatalogVideo() {
    const video = document.getElementById('catalogVideo');
    const btn = document.getElementById('catalogPlayBtn');
    if (!video || !btn) return;

    btn.addEventListener('click', () => {
      if (video.paused) {
        video.muted = false;
        video.volume = 1.0;
        video.play();
        btn.classList.add('is-playing');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      } else {
        video.pause();
        btn.classList.remove('is-playing');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      }
    });

    // Reset button when video ends (if not looping)
    video.addEventListener('ended', () => {
      btn.classList.remove('is-playing');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    });
  }

  /* ═══════════════════════════════════════════════════
     TYPING EFFECT SYSTEM
     ═══════════════════════════════════════════════════ */

  function setupTypingEffect() {
    const targets = [
      {
        container: document.querySelector('#about'),
        elements: ['.about__text-bold', '.about__text-light', '.about__subtext']
      },
      {
        container: document.querySelector('#expertise'),
        elements: ['.expertise__text-bold', '.expertise__text-light', '.expertise__metric-desc']
      }
    ];

    targets.forEach(group => {
      if (!group.container) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startTypingGroup(group);
            observer.unobserve(group.container);
          }
        });
      }, { threshold: 0.15 }); // Lower threshold for better trigger

      observer.observe(group.container);

      // Pre-process: hide all matching elements initially
      group.elements.forEach(selector => {
        const els = group.container.querySelectorAll(selector);
        els.forEach(el => {
          if (el && !el.hasAttribute('data-full-text')) {
            el.setAttribute('data-full-text', el.textContent.trim());
            el.textContent = '';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          }
        });
      });
    });
  }

  async function startTypingGroup(group) {
    if (group.container.id === 'expertise') {
      // For Section 4, type the main text first
      const mainElements = ['.expertise__text-bold', '.expertise__text-light'];
      for (const selector of mainElements) {
        const element = group.container.querySelector(selector);
        if (!element) continue;
        const text = element.getAttribute('data-full-text');
        await typeEffect(element, text, 12);
      }

      // After main text, animate metrics row
      animateExpertiseMetrics(group.container);
      return;
    }

    // Default sequential typing for other groups
    for (const selector of group.elements) {
      const element = group.container.querySelector(selector);
      if (!element) continue;

      const text = element.getAttribute('data-full-text');
      await typeEffect(element, text, 15);
    }
  }

  function animateExpertiseMetrics(container) {
    const metrics = container.querySelectorAll('.expertise__metric');

    metrics.forEach((metric, index) => {
      // 1. Animate Number
      const numberWrap = metric.querySelector('.expertise__metric-number');
      const numDisplay = metric.querySelector('.num');
      const target = parseInt(numberWrap.getAttribute('data-target'), 10);

      if (numDisplay && !isNaN(target)) {
        setTimeout(() => {
          countTo(numDisplay, target, 2000);
        }, index * 200);
      }

      // 2. Type Description
      const desc = metric.querySelector('.expertise__metric-desc');
      if (desc) {
        const text = desc.getAttribute('data-full-text');
        setTimeout(() => {
          typeEffect(desc, text, 10);
        }, index * 400 + 500); // Stagger start after number begins
      }
    });
  }

  function countTo(element, target, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = Math.floor(eased * target);

      // Format number with commas for thousands
      element.textContent = current.toLocaleString('en-US');

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function typeEffect(element, text, speed) {
    return new Promise(resolve => {
      let i = 0;
      element.textContent = ''; // Clear before typing
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      type();
    });
  }



  /* ═══════════════════════════════════════════════════
     SCROLL VIDEO CONTROL (Section 5)
     ═══════════════════════════════════════════════════ */

  function setupScrollVideo() {
    const section = document.getElementById('cinematic');
    const video = document.getElementById('scrollVideo');
    if (!section || !video) return;

    let targetTime = 0;
    let currentTime = 0;
    let isVisible = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { isVisible = entry.isIntersecting; });
    }, { threshold: 0.01 });

    observer.observe(section);

    function updateVideoFrame() {
      if (isVisible) {
        const rect = section.getBoundingClientRect();

        // Reverted to 300vh scroll progress behavior for desktop
        const scrollDistance = -rect.top;
        const maxScroll = rect.height - window.innerHeight;
        const progress = clamp(scrollDistance / Math.max(1, maxScroll), 0, 1);

        if (video.readyState >= 2 && video.duration) {
          targetTime = video.duration * progress;

          // Smooth interpolation (Lerp) for buttery playback
          currentTime += (targetTime - currentTime) * 0.15;
          video.currentTime = currentTime;
        }
      }
      requestAnimationFrame(updateVideoFrame);
    }

    requestAnimationFrame(updateVideoFrame);
  }

  /* ═══════════════════════════════════════════════════
     CATALOG VIDEO CONTROL
     ═══════════════════════════════════════════════════ */
  function setupCatalogVideo() {
    const video = document.getElementById('catalogVideo');
    const container = document.querySelector('.catalog__video-container');
    const btn = document.getElementById('catalogPlayBtn');

    if (!video || !container) return;

    // Start video automatically when entering viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && video.paused) {
            // Attempt to play with SOUND FIRST (works if user has clicked somewhere on the site)
            video.muted = false;
            video.play().catch(() => {
              // Browser blocked it due to anti-spam auto-play policies. 
              // Fallback magically to silent playback so the visually dynamic flow isn't broken!
              video.muted = true;
              video.play().catch(() => { });
            });
          } else if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      }, { threshold: 0.3 }); // Triggered when at least 30% of the video is visible
      observer.observe(container);
    }

    // Toggle sound and pause logic on click
    container.addEventListener('click', () => {
      if (video.muted) {
        // First click: Unmute the video and ensure its playing
        video.muted = false;
        if (video.paused) video.play();
      } else {
        // Subsequent clicks toggle pause/play
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    });

    // CRITICAL: Unlock audio on FIRST page interaction (scroll/click)
    const unlockAudio = () => {
      if (video.muted && !video.paused) {
        // Try to unmute if already playing
        video.muted = false;
      }
      ['click', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
        document.removeEventListener(evt, unlockAudio);
      });
    };
    ['click', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
      document.addEventListener(evt, unlockAudio, { once: true });
    });

    // Elegant UI transitions based on player state
    video.addEventListener('play', () => {
      if (btn) {
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.8)';
      }
    });

    video.addEventListener('pause', () => {
      if (btn) {
        btn.style.opacity = '1';
        btn.style.transform = 'scale(1)';
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     CATALOG CAROUSEL (Section 6)
     ═══════════════════════════════════════════════════ */

  function setupCatalogCarousel() {
    const track = document.getElementById('catalogTrack');
    const originalCards = Array.from(document.querySelectorAll('.catalog__card'));

    if (!track || originalCards.length === 0) return;

    const totalOriginals = originalCards.length; // 5

    // Clone for infinite seamless loop (before and after)
    const beforeClones = originalCards.map(card => card.cloneNode(true));
    const afterClones = originalCards.map(card => card.cloneNode(true));

    beforeClones.forEach(clone => track.insertBefore(clone, originalCards[0]));
    afterClones.forEach(clone => track.appendChild(clone));

    const allCards = document.querySelectorAll('.catalog__card');

    // Start index at the first TRUE original card
    // 0-4: Clones (Before), 5-9: Originals, 10-14: Clones (After)
    let currentIndex = totalOriginals;
    let isTransitioning = false;

    // Instant Setup: Center the first original card without animation
    track.style.transition = 'none';
    const initOffset = currentIndex * 376;
    track.style.transform = `translateX(-${initOffset}px)`;

    allCards.forEach((card, i) => {
      card.classList.toggle('catalog__card--active', i === currentIndex);
    });

    // Force browser reflow to apply instant styles before transition starts
    void track.offsetHeight;

    const updateSlider = (instant = false) => {
      if (instant) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 1.2s var(--ease-luxury)';
      }

      const offset = currentIndex * 376;
      track.style.transform = `translateX(-${offset}px)`;

      allCards.forEach((card, i) => {
        card.classList.toggle('catalog__card--active', i === currentIndex);
      });
    };

    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;

      currentIndex++;
      updateSlider(false);

      // If we slide onto the first AFTER clone (index 10, visually matches index 5)
      if (currentIndex === totalOriginals * 2) {
        setTimeout(() => {
          currentIndex = totalOriginals; // Teleport back to index 5
          updateSlider(true);
          isTransitioning = false;
        }, 1200); // Wait for transition finish
      } else {
        setTimeout(() => isTransitioning = false, 1200);
      }
    };

    setInterval(nextSlide, 4500);
  }

  /* ═══════════════════════════════════════════════════
     INTERIORS SCROLL-TRANSFORM (Section 7 — 10 Pages)
     ═══════════════════════════════════════════════════ */

  function setupInteriorsScrollTransform() {
    const section = document.getElementById('interiors');
    const track = document.getElementById('interiorsScrollTrack');
    const progressBar = document.getElementById('interiorsProgressBar');
    const counterCurrent = document.getElementById('interiorsCounterCurrent');
    if (!section || !track) return;

    const totalPages = 5;
    let isVisible = false;

    // Observe visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { isVisible = entry.isIntersecting; });
    }, { threshold: 0.01 });
    observer.observe(section);

    function updateTransform() {
      if (isVisible) {
        const rect = section.getBoundingClientRect();
        const scrollDistance = -rect.top;
        const maxScroll = rect.height - window.innerHeight;
        const progress = clamp(scrollDistance / maxScroll, 0, 1);

        // Total horizontal distance: (totalPages - 1) pages worth of 100vw
        const totalTranslate = (totalPages - 1) * window.innerWidth;
        const translateX = progress * totalTranslate;

        track.style.transform = `translateX(-${translateX}px)`;

        // Update progress bar
        if (progressBar) {
          progressBar.style.width = `${(progress * 100)}%`;
        }

        // Update counter
        const currentPage = Math.min(Math.floor(progress * totalPages) + 1, totalPages);
        if (counterCurrent) {
          counterCurrent.textContent = currentPage.toString().padStart(2, '0');
        }
      }
      requestAnimationFrame(updateTransform);
    }

    requestAnimationFrame(updateTransform);
  }

  /* ═══════════════════════════════════════════════════
     REVIEWS CAROUSEL (Section 9)
     ═══════════════════════════════════════════════════ */

  function setupReviewsCarousel() {
    const avatarEl = document.getElementById('reviewsAvatar');
    const nameEl = document.getElementById('reviewsName');
    const dateEl = document.getElementById('reviewsDate');
    const textEl = document.getElementById('reviewsText');
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    const card = document.querySelector('.reviews__card');

    if (!nameEl || !textEl) return;

    const reviews = [
      {
        initial: 'W',
        color: '#0097A7',
        name: 'Weverton Oliveira',
        date: '1 year ago',
        text: 'Valintim Flooring restored the hardwood floors in my living room, and they look brand new. The team was punctual, friendly, and very knowledgeable. Fantastic...'
      },
      {
        initial: 'M',
        color: '#E65100',
        name: 'Maria Santos',
        date: '8 months ago',
        text: 'Incredible work on our kitchen remodel. The tile installation was flawless and the attention to detail was beyond anything we expected. Highly recommend!'
      },
      {
        initial: 'J',
        color: '#2E7D32',
        name: 'James Mitchell',
        date: '6 months ago',
        text: 'Valin Remodeling transformed our entire first floor with luxury vinyl plank. The crew was professional, clean, and finished ahead of schedule. Outstanding quality.'
      },
      {
        initial: 'S',
        color: '#6A1B9A',
        name: 'Sarah Thompson',
        date: '3 months ago',
        text: 'We hired them for a full bathroom renovation and the result is stunning. From the porcelain tiles to the custom vanity, every detail was perfect. Five stars!'
      },
      {
        initial: 'R',
        color: '#1565C0',
        name: 'Roberto Lima',
        date: '2 months ago',
        text: 'Best flooring company in Central Florida. They installed engineered hardwood throughout our home and it looks absolutely beautiful. Professional from start to finish.'
      }
    ];

    let currentIndex = 0;
    let autoTimer = null;

    function showReview(index) {
      const r = reviews[index];
      // Fade out
      if (card) card.style.opacity = '0';
      if (card) card.style.transform = 'translateY(8px)';

      setTimeout(() => {
        if (avatarEl) {
          avatarEl.textContent = r.initial;
          avatarEl.style.background = r.color;
        }
        if (nameEl) nameEl.textContent = r.name;
        if (dateEl) dateEl.textContent = r.date;
        if (textEl) textEl.textContent = r.text;

        // Fade in
        if (card) card.style.opacity = '1';
        if (card) card.style.transform = 'translateY(0)';
      }, 300);
    }

    function goNext() {
      currentIndex = (currentIndex + 1) % reviews.length;
      showReview(currentIndex);
      resetTimer();
    }

    function goPrev() {
      currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
      showReview(currentIndex);
      resetTimer();
    }

    function resetTimer() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(goNext, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Start auto-rotation
    resetTimer();
  }

  /** Initialize all components */
  function init() {
    cacheElements();

    if (!el.hero) return;

    // Core Motion System
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Hero Effects
    setupVisibilityObserver();
    animateHeroCounters();

    // Section Revealers
    setupAboutObserver();
    setupTypingEffect();

    // Specialized Sections
    setupScrollVideo();
    setupCatalogVideo();
    setupCatalogCarousel();
    setupInteriorsScrollTransform();
    setupReviewsCarousel();
    setupContactPopup();
    setupGetInTouchForm();

    // Micro-interactions
    setupButtonInteractions();
    setupSmoothScroll();

    // Delay card tilt for entrance
    setTimeout(() => {
      setupCardTilt();
    }, 2800);
  }

  /* ═══════════════════════════════════════════════════
     CONTACT POPUP
     ═══════════════════════════════════════════════════ */

  function setupContactPopup() {
    const openBtn = document.getElementById('contactFloatBtn');
    const overlay = document.getElementById('contactPopupOverlay');
    const closeBtn = document.getElementById('contactPopupClose');
    const form = document.getElementById('contactForm');

    if (!openBtn || !overlay) return;

    openBtn.addEventListener('click', () => {
      overlay.classList.add('is-active');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('is-active');
      });
    }

    // Close on overlay click (outside the card)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('is-active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        overlay.classList.remove('is-active');
      }
    });

    // Handle form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.contact-popup__submit');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Sending...';
          
          const actionUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
          
          fetch(actionUrl, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
          }).then(response => {
            if (response.ok) {
              submitBtn.textContent = 'Message Sent ✓';
              submitBtn.style.background = '#2E7D32';
              setTimeout(() => {
                overlay.classList.remove('is-active');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
              }, 2000);
            } else {
              submitBtn.textContent = 'Error';
              setTimeout(() => submitBtn.textContent = originalText, 3000);
            }
          }).catch(error => {
            submitBtn.textContent = 'Error';
            setTimeout(() => submitBtn.textContent = originalText, 3000);
          });
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════════
     GET IN TOUCH FORM (Section 11)
     ═══════════════════════════════════════════════════ */

  function setupGetInTouchForm() {
    // Disabled AJAX interception to allow native FormSubmit activation and reliable delivery
    /*
    const form = document.getElementById('getInTouchForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.getintouch__submit');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        
        const actionUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        
        fetch(actionUrl, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          // ... 
        });
      }
    });
    */
  }

  // Lifecycle Management
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ═══════════════════════════════════════════════════════════
   FLOATING CONTACT BUTTON — Show after hero section
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function setupFloatingButton() {
    const contactFloat = document.getElementById('contactFloat');
    const hero = document.getElementById('hero');
    if (!contactFloat || !hero) return;

    let isVisible = false;

    function checkScroll() {
      const heroRect = hero.getBoundingClientRect();
      const heroBottom = heroRect.bottom;

      // Show button when hero is scrolled past (hero bottom is above viewport)
      if (heroBottom <= 0 && !isVisible) {
        isVisible = true;
        contactFloat.style.opacity = '1';
        contactFloat.style.pointerEvents = 'auto';
      } else if (heroBottom > 0 && isVisible) {
        isVisible = false;
        contactFloat.style.opacity = '0';
        contactFloat.style.pointerEvents = 'none';
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll(); // Initial check
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFloatingButton);
  } else {
    setupFloatingButton();
  }
})();

/* ═══════════════════════════════════════════════════════════
   NAV COLOR SWITCH — Dark text on light backgrounds
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function setupNavColorSwitch() {
    const nav = document.getElementById('heroNav');
    if (!nav) return;

    // IDs of sections with light/white backgrounds
    const lightSectionIds = ['about', 'expertise', 'catalog', 'interiors', 'reviews', 'contactInfo'];
    const lightSections = lightSectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (lightSections.length === 0) return;

    let activeLightSections = new Set();

    // Observer triggers when sections enter/leave the top 70px of viewport (where nav sits)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeLightSections.add(entry.target.id);
        } else {
          activeLightSections.delete(entry.target.id);
        }
      });

      if (activeLightSections.size > 0) {
        nav.classList.add('hero__nav--on-light');
      } else {
        nav.classList.remove('hero__nav--on-light');
      }
    }, {
      // Only observe the top 70px strip where the nav bar sits
      rootMargin: '0px 0px -95% 0px',
      threshold: 0
    });

    lightSections.forEach(section => observer.observe(section));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNavColorSwitch);
  } else {
    setupNavColorSwitch();
  }
})();

/* ═══════════════════════════════════════════════════════════
   BEFORE/AFTER SLIDER INTERACTION (Section 11)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function setupBASlider() {
    const range = document.getElementById('baSliderRange');
    const before = document.getElementById('baBefore');
    const handleLine = document.getElementById('baHandleLine');

    if (!range || !before || !handleLine) return;

    range.addEventListener('input', (e) => {
      const value = e.target.value;
      before.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      before.style.webkitClipPath = `inset(0 ${100 - value}% 0 0)`;
      handleLine.style.left = `${value}%`;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBASlider);
  } else {
    setupBASlider();
  }
})();

