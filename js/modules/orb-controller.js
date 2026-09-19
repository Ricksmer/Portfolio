/**
 * Say Hi Orb & Floating Contacts Controller
 * Implements Item #6:
 * Eliminates jitter/glitch when moving between the orb and floating pills.
 * Tracks cursor proximity: stays open within a 250px radius, closes cleanly when moving away.
 */
export function initOrbController() {
  const container = document.querySelector('.sayhi-container');
  const orb = document.querySelector('.chrome-orb');
  if (!container || !orb) return;

  let isOpen = false;
  let closeTimeout = null;

  function getOrbCenter() {
    const rect = orb.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function openArc() {
    clearTimeout(closeTimeout);
    closeTimeout = null;
    isOpen = true;
    container.classList.add('is-open');
  }

  function closeArc() {
    clearTimeout(closeTimeout);
    closeTimeout = null;
    isOpen = false;
    container.classList.remove('is-open');
  }

  // Hover over container or orb triggers open
  container.addEventListener('mouseenter', openArc);

  // Click on the orb toggles open state
  orb.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeArc();
    } else {
      openArc();
    }
  });

  // Global mousemove tracking with generous proximity buffer
  window.addEventListener('mousemove', (e) => {
    if (!isOpen) return;

    // Never close if the mouse is actively hovering inside the container or over any contact pill
    if (e.target && (e.target.closest('.sayhi-container') || e.target.closest('.contact-pill'))) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
      return;
    }

    const center = getOrbCenter();
    const distance = Math.hypot(e.clientX - center.x, e.clientY - center.y);

    // If mouse moves beyond 360px from the orb center, smoothly close
    if (distance > 360) {
      if (!closeTimeout) {
        closeTimeout = setTimeout(closeArc, 120);
      }
    } else {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }, { passive: true });

  // Clicking outside closes the arc
  document.addEventListener('click', (e) => {
    if (isOpen && !e.target.closest('.sayhi-container')) {
      closeArc();
    }
  });
}
