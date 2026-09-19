/**
 * Animations & Scroll Orchestrations Module
 * Integrates GSAP, ScrollTrigger, Lenis smooth inertia scrolling,
 * liquid chrome text shimmer reveals, kinetic velocity tilt,
 * editorial word scrubbing, and cinematic entrance/exit sequences.
 */

export function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Lenis Smooth Inertia Scroll Setup
  let lenisInstance = null;
  if (window.Lenis && !reduced) {
    try {
      lenisInstance = new window.Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95
      });
      window.__lenis = lenisInstance;

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      if (window.ScrollTrigger) {
        lenisInstance.on('scroll', window.ScrollTrigger.update);
      }
    } catch (e) {
      console.warn('Lenis smooth scroll notice:', e);
    }
  }

  // 2. Kinetic Velocity Scroll Interaction (Punk Chrome Feel)
  if (!reduced) {
    initKineticScrollTilt(lenisInstance);
  }

  // 3. GSAP & ScrollTrigger Orchestrations
  if (window.gsap && window.ScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);

      // A. Cinematic Page Load Entrance Sequence
      if (!reduced) {
        initPageLoadEntrance();
      }

      // B. Scroll-Driven Liquid Chrome Shimmer on Headings
      initChromeTextShimmer();

      // C. Editorial Paragraph Word Scrub
      initEditorialWordScrub();

      // D. Staggered Card & Section Reveals (Blur to Focus)
      initSectionReveals(reduced);

      // E. Hero Parallax Drift
      if (!reduced) {
        window.gsap.to('.hero-content-block', {
          y: -70,
          opacity: 0.4,
          scrollTrigger: {
            trigger: '#intro',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
          }
        });

        // Parallax drift on Ghost Outline Typography
        window.gsap.to('.ghost-outline-type', {
          y: -120,
          scrollTrigger: {
            trigger: '#intro',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          }
        });

        // F. Scroll-Driven Optical Glass Refractor Drift
        initOpticalRefractors();
      }
    } catch (e) {
      console.warn('GSAP animation notice:', e);
    }
  } else {
    // Fallback: make all reveals visible immediately
    document.querySelectorAll('.reveal, .project-card, .achievement-card, .experience-item').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  }

  // 4. Horizontal Drag Handler for Achievements Strip
  initAchievementsDrag();
}

/**
 * Initial Page Load Entrance Sequence
 */
function initPageLoadEntrance() {
  const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(
    '.top-nav-island',
    { y: -35, opacity: 0, scale: 0.97 },
    { y: 0, opacity: 1, scale: 1, duration: 1.1, delay: 0.1 }
  )
  .fromTo(
    '.editorial-stamp, .hero-kicker',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
    '-=0.7'
  )
  .fromTo(
    '.hero-name',
    { y: 40, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1 },
    '-=0.6'
  )
  .fromTo(
    '.hero-subline',
    { y: 22, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.85 },
    '-=0.7'
  )
  .fromTo(
    '.hero-meta, .admin-trigger-wrap, .scroll-cue',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
    '-=0.5'
  );
}

/**
 * Kinetic Velocity Scroll Tilt (Punk Chrome Tactility)
 * Cards and headings react dynamically to scrolling momentum
 */
function initKineticScrollTilt(lenisInstance) {
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  if (lenisInstance) {
    lenisInstance.on('scroll', (e) => {
      scrollVelocity = e.velocity || 0;
    });
  } else {
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      scrollVelocity = (currentY - lastScrollY) * 0.25;
      lastScrollY = currentY;
    }, { passive: true });
  }

  const skewTargets = document.querySelectorAll('.project-card, .achievement-card');
  if (!skewTargets.length) return;

  let currentSkew = 0;
  function updateTilt() {
    scrollVelocity *= 0.88;
    const targetSkew = Math.max(-1.8, Math.min(1.8, scrollVelocity * 0.08));
    currentSkew += (targetSkew - currentSkew) * 0.12;

    if (Math.abs(currentSkew) > 0.01) {
      skewTargets.forEach((card) => {
        card.style.transform = `skewY(${currentSkew.toFixed(2)}deg)`;
      });
    } else {
      skewTargets.forEach((card) => {
        card.style.transform = '';
      });
    }

    requestAnimationFrame(updateTilt);
  }
  requestAnimationFrame(updateTilt);
}

/**
 * Scroll-Driven Liquid Chrome Shimmer on Headings
 * Sweeps a specular metallic reflection across the letters as the user scrolls
 */
function initChromeTextShimmer() {
  const headings = document.querySelectorAll('.eyebrow, .hero-name, .project-card-title, .ach-title, .exp-role');
  headings.forEach((el) => {
    el.classList.add('chrome-text-shimmer');

    window.ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      end: 'bottom 15%',
      scrub: 0.6,
      onUpdate: (self) => {
        const pos = (130 - self.progress * 220).toFixed(1);
        el.style.setProperty('--shimmer-pos', `${pos}%`);
      }
    });
  });
}

/**
 * Editorial Paragraph Word Scrub
 * Progressively illuminates words as they pass the viewport reading zone
 */
function initEditorialWordScrub() {
  const leadEl = document.querySelector('.about-lead');
  if (!leadEl) return;

  const rawText = leadEl.textContent.trim();
  const words = rawText.split(/\s+/);
  leadEl.innerHTML = words.map(w => `<span class="editorial-scrub-word">${w}</span>`).join(' ');

  const wordSpans = leadEl.querySelectorAll('.editorial-scrub-word');
  if (!wordSpans.length) return;

  window.ScrollTrigger.create({
    trigger: leadEl,
    start: 'top 85%',
    end: 'bottom 35%',
    scrub: 0.5,
    onUpdate: (self) => {
      const illuminatedCount = Math.floor(self.progress * wordSpans.length);
      wordSpans.forEach((span, idx) => {
        if (idx <= illuminatedCount) {
          span.classList.add('is-illuminated');
        } else {
          span.classList.remove('is-illuminated');
        }
      });
    }
  });
}

/**
 * Section & Card Reveals with Smooth Blur-to-Focus
 */
function initSectionReveals(reduced) {
  // Reveal elements
  window.gsap.utils.toArray('.reveal').forEach((el) => {
    window.gsap.fromTo(
      el,
      {
        opacity: 0,
        y: reduced ? 0 : 32,
        filter: reduced ? 'none' : 'blur(6px)'
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 96%',
          once: true
        }
      }
    );
  });

  // Project cards stagger
  window.gsap.utils.toArray('.project-card').forEach((card, index) => {
    window.gsap.fromTo(
      card,
      {
        opacity: 0,
        y: reduced ? 0 : 28,
        filter: reduced ? 'none' : 'blur(6px)'
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        delay: (index % 2) * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 96%',
          once: true
        }
      }
    );
  });

  // Achievement cards stagger
  window.gsap.utils.toArray('.achievement-card').forEach((card, index) => {
    window.gsap.fromTo(
      card,
      {
        opacity: 0,
        y: reduced ? 0 : 24
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 96%',
          once: true
        }
      }
    );
  });

  // Experience items stagger
  window.gsap.utils.toArray('.experience-item').forEach((item, index) => {
    window.gsap.fromTo(
      item,
      {
        opacity: 0,
        y: reduced ? 0 : 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 96%',
          once: true
        }
      }
    );
  });
}

/**
 * Achievements Horizontal Drag Interaction
 */
function initAchievementsDrag() {
  const wrapper = document.querySelector('.achievements-strip-wrapper');
  const strip = document.querySelector('.achievements-strip');
  if (!wrapper || !strip) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.6;
    wrapper.scrollLeft = scrollLeft - walk;
  });
}

/**
 * Transient Optical Glass Refractors
 * Momentarily sweeps across section titles during scroll transition and exits immediately,
 * ensuring 100% text legibility without ever lingering over body text.
 */
function initOpticalRefractors() {
  const refAbout = document.getElementById('refractor-about');
  if (refAbout) {
    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top 85%',
        end: 'top 20%',
        scrub: 0.8
      }
    });

    tl.fromTo(
      refAbout,
      { x: 120, y: -40, opacity: 0, scale: 0.5, rotate: -15 },
      { x: 0, y: 0, opacity: 0.9, scale: 1.0, rotate: 0, duration: 0.4 }
    ).to(
      refAbout,
      { x: -180, y: 30, opacity: 0, scale: 0.5, rotate: 20, duration: 0.6 }
    );
  }

  const refProjects = document.getElementById('refractor-projects');
  if (refProjects) {
    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 85%',
        end: 'top 20%',
        scrub: 0.8
      }
    });

    tl.fromTo(
      refProjects,
      { x: -120, y: -30, opacity: 0, scale: 0.5, rotate: 15 },
      { x: 0, y: 0, opacity: 0.9, scale: 1.0, rotate: 0, duration: 0.4 }
    ).to(
      refProjects,
      { x: 180, y: 35, opacity: 0, scale: 0.5, rotate: -20, duration: 0.6 }
    );
  }
}

