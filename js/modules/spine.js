/**
 * Timeline Spine Navigation Module
 * 7 Defined Sections: Intro, About, Projects, Achievements, Experience, Stack, More
 */
export function initSpine() {
  const spineItems = document.querySelectorAll('.spine-item');
  if (!spineItems.length) return;

  const sectionIds = Array.from(spineItems).map(item => item.getAttribute('data-target'));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Click smooth-scroll
  spineItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Active section observer
  function updateActiveSpine() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const triggerLine = scrollY + windowH * 0.35;

    let currentSectionId = sectionIds[0];

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const top = sec.offsetTop;
      const height = sec.offsetHeight;

      if (triggerLine >= top && triggerLine < top + height) {
        currentSectionId = sec.id;
        break;
      }
    }

    // Edge check for bottom of page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 60) {
      currentSectionId = sectionIds[sectionIds.length - 1];
    }

    spineItems.forEach(item => {
      if (item.getAttribute('data-target') === currentSectionId) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveSpine, { passive: true });
  updateActiveSpine();
}
