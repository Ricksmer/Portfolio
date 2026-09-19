/**
 * Top Navigation Header Island Controller
 * Handles real-time Cebu City timecode ticker (GMT+8),
 * bi-directional scroll synchronization across all 7 sections,
 * and smooth navigation triggers.
 */

export function initHeader() {
  const header = document.querySelector('.top-nav-island');
  if (!header) return;

  // 1. Live Cebu City (GMT+8) Clock
  initCebuClock();

  // 2. Navigation Tab Click Listeners
  initTabNavigation();

  // 3. Scroll Synchronization with Sections
  initScrollSync();
}

/**
 * Real-time Cebu City Digital Clock (Philippine Standard Time, UTC+8)
 */
function initCebuClock() {
  const timeEl = document.getElementById('nav-live-time');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    try {
      const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
      timeEl.textContent = `CEBU ${timeString} PHT`;
    } catch {
      // Fallback
      const hours = String((now.getUTCHours() + 8) % 24).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      timeEl.textContent = `CEBU ${hours}:${mins}:${secs} PHT`;
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/**
 * Tab Click Smooth Scroll
 */
function initTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      if (window.__lenis) {
        window.__lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
      } else {
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Scroll Sync using IntersectionObserver & Scroll position
 */
function initScrollSync() {
  const sectionIds = ['intro', 'about', 'projects', 'achievements', 'experience', 'stack', 'more'];
  const tabs = document.querySelectorAll('.nav-tab-btn');
  if (!tabs.length) return;

  function updateActiveTab() {
    const scrollPos = window.scrollY + 160;
    let currentId = 'intro';

    for (const id of sectionIds) {
      const sec = document.getElementById(id);
      if (sec && sec.offsetTop <= scrollPos) {
        currentId = id;
      }
    }

    tabs.forEach((tab) => {
      if (tab.getAttribute('data-target') === currentId) {
        tab.classList.add('is-active');
      } else {
        tab.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveTab, { passive: true });
  updateActiveTab();
}
