/**
 * Main Application Bootstrap
 * Orchestrates modular architecture and component lifecycles
 * Protected with per-module error boundaries
 */
import { PROJECTS } from './data/portfolioData.js';
import { ACHIEVEMENTS } from './data/portfolioData.js';
import { EXPERIENCE } from './data/portfolioData.js';

import { initWebGLTorus } from './modules/webgl-torus.js';
import { initCursor } from './modules/cursor.js';
import { initSpine } from './modules/spine.js';
import { initTechMarquee } from './modules/marquee.js';
import { initArcCarousel } from './modules/arc-carousel.js';
import { initDetailModal } from './modules/detail-modal.js';
import { initAnimations } from './modules/animations.js';
import { initOrbController } from './modules/orb-controller.js';
import { initAdminAuth, getAttachedPhoto } from './modules/admin-auth.js';
import { initHeader } from './modules/header.js';
import { initMagneticElements, init3DCardTilt } from './modules/motion-system.js';

function safeRun(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[Portfolio Bootstrap] Error initializing ${name}:`, err);
  }
}

function bootstrap() {
  // 1. Render Dynamic Project Cards with Prominent Tags & Dedicated Arrow Container
  safeRun('renderProjects', renderProjects);

  // 2. Render Dynamic Achievements Cards
  safeRun('renderAchievements', renderAchievements);

  // 3. Render Dynamic Experience Items
  safeRun('renderExperience', renderExperience);

  // 4. Initialize Core Interactive Components
  safeRun('initCursor', initCursor);
  safeRun('initHeader', initHeader);
  safeRun('initSpine', initSpine);
  safeRun('initTechMarquee', initTechMarquee);
  safeRun('initArcCarousel', initArcCarousel);
  safeRun('initDetailModal', initDetailModal);
  safeRun('initOrbController', initOrbController);
  safeRun('initAdminAuth', initAdminAuth);

  // 5. Initialize WebGL 3D Liquid Chrome Star Centerpiece
  safeRun('initWebGLTorus', initWebGLTorus);

  // 6. Initialize GSAP / Lenis / Motion Orchestrations
  safeRun('initAnimations', initAnimations);

  // 7. Initialize Magnetic Attractions & 3D Tilt Physics
  safeRun('initMagneticElements', () => initMagneticElements());
  safeRun('init3DCardTilt', () => init3DCardTilt());
}

// Immediate or deferred execution guard
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

/**
 * Render Project Cards with Prominent Tech Tags & Dedicated Arrow Container
 */
/**
 * Render Project Cards with Prominent Tech Tags & Dedicated Arrow Container
 */
function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = PROJECTS.map((p) => {
    const attachedPhoto = getAttachedPhoto(`card_photo_${p.id}`);
    return `
      <article class="project-card hud-frame" data-detail-type="projects" data-detail-id="${p.id}" data-cursor="view" data-tilt>
        <div class="hud-bracket hud-bracket-tl" aria-hidden="true"></div>
        <div class="hud-bracket hud-bracket-tr" aria-hidden="true"></div>
        <div class="hud-bracket hud-bracket-bl" aria-hidden="true"></div>
        <div class="hud-bracket hud-bracket-br" aria-hidden="true"></div>
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
          <button class="project-arrow-btn" type="button" aria-label="View specifications for ${p.name}">
            <span>SPECS</span> <span class="arrow-glyph">→</span>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Render Achievements Strip with Cyber HUD Brackets & Spec Buttons
 */
function renderAchievements() {
  const container = document.getElementById('achievements-strip');
  if (!container) return;

  container.innerHTML = ACHIEVEMENTS.map((a, idx) => `
    <div class="achievement-card hud-frame" data-detail-type="achievements" data-detail-id="${a.id}" data-cursor="view" data-tilt>
      <div class="hud-bracket hud-bracket-tl" aria-hidden="true"></div>
      <div class="hud-bracket hud-bracket-tr" aria-hidden="true"></div>
      <div class="hud-bracket hud-bracket-bl" aria-hidden="true"></div>
      <div class="hud-bracket hud-bracket-br" aria-hidden="true"></div>
      <div class="ach-card-top">
        <div class="ach-serial-row">
          <span class="ach-year">${a.year}</span>
          <span class="ach-index-tag">[HONOR // 0${idx + 1}]</span>
        </div>
        <div class="ach-tag">${a.tag}</div>
        <h4 class="ach-title">${a.title}</h4>
      </div>
      <div class="ach-card-bottom">
        <div class="ach-meta">${a.meta}</div>
        <div class="ach-footer-row">
          <span class="project-arrow-btn">
            <span>SPECS</span> <span class="arrow-glyph">→</span>
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Experience Stack with Circuit Trace Log Details
 */
function renderExperience() {
  const container = document.getElementById('experience-stack');
  if (!container) return;

  container.innerHTML = EXPERIENCE.map((e, idx) => `
    <div class="experience-item hud-frame" data-detail-type="experience" data-detail-id="${e.id}" data-cursor="view" data-tilt>
      <div class="hud-bracket hud-bracket-tl" aria-hidden="true"></div>
      <div class="hud-bracket hud-bracket-tr" aria-hidden="true"></div>
      <div class="hud-bracket hud-bracket-bl" aria-hidden="true"></div>
      <div class="hud-bracket hud-bracket-br" aria-hidden="true"></div>
      <div class="exp-role-block">
        <div class="exp-badge">// LOG // 0${idx + 1} — LEADERSHIP</div>
        <h4 class="exp-role">${e.role}</h4>
        <div class="exp-org">${e.org}</div>
      </div>
      <div class="exp-side-actions">
        <div class="exp-period">${e.period}</div>
        <button class="project-arrow-btn" type="button" aria-label="View record for ${e.role}">
          <span>DOSSIER</span> <span class="arrow-glyph">→</span>
        </button>
      </div>
    </div>
  `).join('');
}
