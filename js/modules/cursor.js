/**
 * Custom Interactive Cursor Module
 * Smooth tracking precision cursor with clean hover expansion
 */
export function initCursor() {
  // Disable on touch devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const ring = document.querySelector('.cursor-ring');
  const dot = document.querySelector('.cursor-dot');

  if (!ring || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  // Track real pointer position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Smooth lerp loop for the outer ring
  function render() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Clean hover detection without text clutter
  const interactiveSelectors = 'a, button, [tabindex], .project-card, .achievement-card, .experience-item, .arc-card, .chrome-orb, .contact-pill, .tech-chip';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.add('is-hovering');
      dot.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.remove('is-hovering');
      dot.classList.remove('is-hovering');
    }
  });
}
