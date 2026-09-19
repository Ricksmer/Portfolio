/**
 * Animations & Scroll Orchestrations Module
 * Integrates GSAP, ScrollTrigger, Lenis smooth scrolling, and magnetic effects
 */

export function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Lenis Smooth Scroll Setup
  if (window.Lenis && !reduced) {
    try {
      const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis smooth scroll notice:', e);
    }
  }

  // 2. GSAP & ScrollTrigger Reveals
  if (window.gsap && window.ScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);

      // Fade/slide-up reveals
      window.gsap.utils.toArray('.reveal').forEach((el) => {
        window.gsap.fromTo(
          el,
          { opacity: 0, y: reduced ? 0 : 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%'
            }
          }
        );
      });

      // Hero text parallax
      if (!reduced) {
        window.gsap.to('.hero-content-block', {
          y: -70,
          opacity: 0.35,
          scrollTrigger: {
            trigger: '#intro',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // Project cards stagger
      window.gsap.fromTo(
        '.project-card',
        { opacity: 0, y: reduced ? 0 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%'
          }
        }
      );
    } catch (e) {
      console.warn('GSAP animation notice:', e);
    }
  } else {
    // Fallback: make all reveals visible immediately
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // 3. Magnetic Hover Effect on Chrome "Say Hi" Orb
  initMagneticOrb();

  // 4. Horizontal Drag Handler for Achievements Strip
  initAchievementsDrag();
}

/**
 * Magnetic attraction on the Chrome Orb
 */
function initMagneticOrb() {
  const orb = document.querySelector('.chrome-orb');
  const container = document.querySelector('.contact-block');
  if (!orb || !container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = orb.getBoundingClientRect();
    const orbCenterX = rect.left + rect.width / 2;
    const orbCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - orbCenterX) * 0.28;
    const deltaY = (e.clientY - orbCenterY) * 0.28;

    orb.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  });

  container.addEventListener('mouseleave', () => {
    orb.style.transform = 'translate(0px, 0px)';
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
