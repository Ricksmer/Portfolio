/**
 * Central Motion System & Interactive Physics Engine
 * 
 * Provides unified timing tokens, magnetic springs, 3D card perspective tilt,
 * liquid-chromatic shimmer sweeps, and GPU optimization lifecycle listeners.
 */

export const MOTION_TOKENS = {
  easeChrome: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  durationFast: 0.25,
  durationMedium: 0.6,
  durationSlow: 1.1,
  durationIntro: 1.4,
  staggerCards: 0.08,
  staggerText: 0.04
};

export const isReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Initializes magnetic attraction on elements with [data-magnetic] or selector
 */
export function initMagneticElements(selector = '.nav-cta-btn, .chrome-orb, .nav-tab-btn, .pill, .arc-nav-btn') {
  if (isReducedMotion() || window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    let bounds = el.getBoundingClientRect();

    function onMouseEnter() {
      bounds = el.getBoundingClientRect();
    }

    function onMouseMove(e) {
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const deltaX = (e.clientX - centerX) * 0.28;
      const deltaY = (e.clientY - centerY) * 0.28;

      el.style.transform = `translate(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px)`;
    }

    function onMouseLeave() {
      el.style.transform = 'translate(0px, 0px)';
      el.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        el.style.transition = '';
      }, 450);
    }

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
  });
}

/**
 * Initializes 3D card perspective tilt with dynamic specular highlight
 */
export function init3DCardTilt(selector = '.project-card, .achievement-card, .credential-card') {
  if (isReducedMotion() || window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const cards = document.querySelectorAll(selector);
  cards.forEach((card) => {
    let reqId = null;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    function renderLoop() {
      currentRotX += (targetRotX - currentRotX) * 0.14;
      currentRotY += (targetRotY - currentRotY) * 0.14;

      card.style.transform = `perspective(900px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(6px)`;

      if (Math.abs(targetRotX - currentRotX) > 0.02 || Math.abs(targetRotY - currentRotY) > 0.02) {
        reqId = requestAnimationFrame(renderLoop);
      } else {
        reqId = null;
      }
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt +- 7 degrees
      targetRotY = ((x - centerX) / centerX) * 7;
      targetRotX = -((y - centerY) / centerY) * 7;

      // Update specular gradient highlight position
      const percentX = ((x / rect.width) * 100).toFixed(1);
      const percentY = ((y / rect.height) * 100).toFixed(1);
      card.style.setProperty('--card-glint-x', `${percentX}%`);
      card.style.setProperty('--card-glint-y', `${percentY}%`);

      if (!reqId) {
        reqId = requestAnimationFrame(renderLoop);
      }
    });

    card.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
      if (!reqId) {
        reqId = requestAnimationFrame(renderLoop);
      }
    });
  });
}

/**
 * Global Tab Visibility & GPU Throttle
 * Pauses heavy animations and WebGL rendering loop when tab is hidden
 */
export function initVisibilityManager(onHiddenCallback, onVisibleCallback) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (onHiddenCallback) onHiddenCallback();
    } else {
      if (onVisibleCallback) onVisibleCallback();
    }
  });
}
