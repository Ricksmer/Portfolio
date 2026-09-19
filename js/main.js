/**
 * Main Application Bootstrap
 * Orchestrates modular architecture and component lifecycles
 */
import { PROJECTS } from './data/projects.js';
import { ACHIEVEMENTS } from './data/achievements.js';
import { EXPERIENCE } from './data/experience.js';

import { initWebGLTorus } from './modules/webgl-torus.js';
import { initCursor } from './modules/cursor.js';
import { initSpine } from './modules/spine.js';
import { initTechMarquee } from './modules/marquee.js';
import { initArcCarousel } from './modules/arc-carousel.js';
import { initDetailModal } from './modules/detail-modal.js';
import { initAnimations } from './modules/animations.js';
import { initOrbController } from './modules/orb-controller.js';
import { initAdminAuth, getAttachedPhoto } from './modules/admin-auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Render Dynamic Project Cards with Prominent Tags & Dedicated Arrow Container (Item #8)
  renderProjects();

  // 2. Render Dynamic Achievements Cards
  renderAchievements();

  // 3. Render Dynamic Experience Items
  renderExperience();

  // 4. Initialize Core Interactive Components
  initCursor();
  initSpine();
  initTechMarquee();
  initArcCarousel();
  initDetailModal();
  initOrbController();
  initAdminAuth();

  // 5. Initialize WebGL 3D Glass Donut & Big Chrome Centerpiece (Items #5, #7, #8, #11)
  await initWebGLTorus();

  // 6. Initialize GSAP / Lenis / Magnetic Interactions
  initAnimations();
});

/**
 * Render Project Cards with Prominent Tech Tags & Dedicated Arrow Container
 */
function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = PROJECTS.map((p) => {
    const attachedPhoto = getAttachedPhoto(`card_photo_${p.id}`);
    return `
      <article class="project-card" data-detail-type="projects" data-detail-id="${p.id}" data-cursor="view">
        ${attachedPhoto ? `<div class="cms-card-cover" style="background-image: url('${attachedPhoto}');"></div>` : ''}
        <div class="project-card-header">
          <div class="project-card-kicker">${p.kicker}</div>
          <h3 class="project-card-title">${p.name}</h3>
        </div>
        <p class="project-card-lead">${p.lead}</p>
        <div class="project-card-footer">
          <div class="project-tags">
            ${p.tags.map(t => `<span class="p-tag">${t}</span>`).join('')}
          </div>
          <div class="project-arrow-btn" aria-hidden="true">→</div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Render Achievements Strip
 */
function renderAchievements() {
  const container = document.getElementById('achievements-strip');
  if (!container) return;

  container.innerHTML = ACHIEVEMENTS.map((a) => `
    <div class="achievement-card" data-detail-type="achievements" data-detail-id="${a.id}" data-cursor="view">
      <div>
        <div class="ach-year">${a.year}</div>
        <div class="ach-tag">${a.tag}</div>
        <h4 class="ach-title">${a.title}</h4>
      </div>
      <div class="ach-meta">${a.meta}</div>
    </div>
  `).join('');
}

/**
 * Render Experience Stack
 */
function renderExperience() {
  const container = document.getElementById('experience-stack');
  if (!container) return;

  container.innerHTML = EXPERIENCE.map((e) => `
    <div class="experience-item" data-detail-type="experience" data-detail-id="${e.id}" data-cursor="view">
      <div class="exp-role-block">
        <h4 class="exp-role">${e.role}</h4>
        <div class="exp-org">${e.org}</div>
      </div>
      <div class="exp-period">${e.period}</div>
    </div>
  `).join('');
}
