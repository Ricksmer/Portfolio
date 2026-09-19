/**
 * 3D Arc / Coverflow Carousel Controller
 * Creative Portfolio Teaser Section
 * Renders cards along an elliptical curved 3D arc with drag, nav buttons, and teaser routing
 */
import { CREATIVE_ITEMS, CREATIVE_EXTERNAL_URL } from '../data/creative.js';

export function initArcCarousel() {
  const track = document.getElementById('arc-carousel-track');
  const prevBtn = document.getElementById('arc-prev-btn');
  const nextBtn = document.getElementById('arc-next-btn');
  const counterEl = document.getElementById('arc-counter');

  if (!track) return;

  let activeIndex = 0;
  const total = CREATIVE_ITEMS.length;
  let isDragging = false;
  let startX = 0;
  let currentDragOffset = 0;
  let autoTimer = null;

  // Render cards
  track.innerHTML = '';
  const cardElements = [];

  CREATIVE_ITEMS.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'arc-card';
    card.setAttribute('data-index', index);
    card.setAttribute('data-cursor', 'OPEN');
    card.innerHTML = `
      <div class="arc-card-inner">
        <div class="arc-card-fig"></div>
        <div class="arc-card-info">
          <span class="arc-card-category">${item.category}</span>
          <h4 class="arc-card-title">${item.title}</h4>
          <p class="arc-card-desc">${item.previewText}</p>
        </div>
      </div>
      <div class="arc-card-teaser">
        <span>Open creative portfolio? →</span>
      </div>
    `;

    // Click handler: if active card, open external portfolio; if adjacent card, center it
    card.addEventListener('click', (e) => {
      if (Math.abs(currentDragOffset) > 10) return; // Ignore if user was dragging
      if (index === activeIndex) {
        window.open(CREATIVE_EXTERNAL_URL, '_blank', 'noopener');
      } else {
        setActiveIndex(index);
      }
    });

    track.appendChild(card);
    cardElements.push(card);
  });

  // Calculate 3D Arc positioning for all cards
  function updateArcLayout() {
    cardElements.forEach((card, index) => {
      // Calculate signed distance from active card
      let diff = index - activeIndex;

      // Wrap around for circular perception
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      const isCenter = diff === 0;
      const absDiff = Math.abs(diff);

      // Arc curve geometry:
      // translateX spreads them along x-axis
      // translateZ pushes background cards deeper into screen
      // rotateY turns them inward toward center like a hand of cards
      const spacingX = window.innerWidth < 768 ? 140 : 210;
      const posX = diff * spacingX;
      const posZ = -Math.pow(absDiff, 1.35) * 110;
      const rotY = diff * -18; // Angles inward toward the viewer
      const scale = Math.max(0.72, 1 - absDiff * 0.12);
      const opacity = Math.max(0.18, 1 - absDiff * 0.28);
      const zIndex = 100 - absDiff;

      card.style.transform = `translateX(${posX}px) translateZ(${posZ}px) rotateY(${rotY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.filter = isCenter ? 'none' : 'brightness(0.7) blur(1px)';
      card.classList.toggle('is-center', isCenter);
    });

    if (counterEl) {
      counterEl.textContent = `0${activeIndex + 1} / 0${total}`;
    }
  }

  function setActiveIndex(newIndex) {
    activeIndex = (newIndex + total) % total;
    updateArcLayout();
  }

  // Navigation button events
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setActiveIndex(activeIndex - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setActiveIndex(activeIndex + 1);
      resetAutoPlay();
    });
  }

  // Keyboard navigation
  track.parentElement.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      setActiveIndex(activeIndex - 1);
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      setActiveIndex(activeIndex + 1);
      resetAutoPlay();
    }
  });

  // Mouse drag & touch swipe
  const stage = track.parentElement;

  function onPointerDown(e) {
    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    currentDragOffset = 0;
    clearInterval(autoTimer);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    currentDragOffset = clientX - startX;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    if (currentDragOffset < -45) {
      setActiveIndex(activeIndex + 1);
    } else if (currentDragOffset > 45) {
      setActiveIndex(activeIndex - 1);
    }
    resetAutoPlay();
  }

  stage.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  stage.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Auto progression
  function startAutoPlay() {
    autoTimer = setInterval(() => {
      setActiveIndex(activeIndex + 1);
    }, 5500);
  }

  function resetAutoPlay() {
    clearInterval(autoTimer);
    startAutoPlay();
  }

  stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
  stage.addEventListener('mouseleave', () => resetAutoPlay());

  // Initialize
  updateArcLayout();
  startAutoPlay();
}
