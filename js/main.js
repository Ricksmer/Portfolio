/**
 * Main Application Bootstrap
 * Orchestrates modular architecture and component lifecycles
 * Protected with per-module error boundaries
 */
import { PROJECTS, ACHIEVEMENTS, EXPERIENCE } from './data/portfolioData.js';
import { store } from './modules/store/contentStore.js';
import { COMPONENT_REGISTRY } from './modules/registry/componentRegistry.js';
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

async function bootstrap() {
  // 0. Initialize Single Source of Truth Content Store
  await safeRun('store.init', () => store.init());

  // 1. Annotate Static DOM elements with Content IDs
  safeRun('annotateStaticElements', annotateStaticElements);

  // 2. Render Dynamic Project Cards with Prominent Tags & Dedicated Arrow Container
  safeRun('renderProjects', renderProjects);

  // 3. Render Dynamic Achievements Cards
  safeRun('renderAchievements', renderAchievements);

  // 4. Render Dynamic Experience Items
  safeRun('renderExperience', renderExperience);

  // 5. Initialize Core Interactive Components
  safeRun('initCursor', initCursor);
  safeRun('initHeader', initHeader);
  safeRun('initSpine', initSpine);
  safeRun('initTechMarquee', initTechMarquee);
  safeRun('initArcCarousel', initArcCarousel);
  safeRun('initDetailModal', initDetailModal);
  safeRun('initOrbController', initOrbController);
  safeRun('initAdminAuth', initAdminAuth);

  // 6. Initialize WebGL 3D Liquid Chrome Star Centerpiece
  safeRun('initWebGLTorus', initWebGLTorus);

  // 7. Initialize GSAP / Lenis / Motion Orchestrations
  safeRun('initAnimations', initAnimations);

  // 8. Initialize Magnetic Attractions & 3D Tilt Physics
  safeRun('initMagneticElements', () => initMagneticElements());
  safeRun('init3DCardTilt', () => init3DCardTilt());

  // Register live re-renderer for Edit/Render synchronization
  window.__refreshPublicSite = (state) => {
    safeRun('renderProjects', renderProjects);
    safeRun('renderAchievements', renderAchievements);
    safeRun('renderExperience', renderExperience);
    safeRun('syncAnnotatedElements', () => syncAnnotatedElements(state));
    safeRun('init3DCardTilt', () => init3DCardTilt());
  };
}

// Immediate or deferred execution guard
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

/**
 * Annotates static HTML sections with Content Item IDs for Render-View selection
 */
function annotateStaticElements() {
  const map = [
    { sel: '.hero-name', id: 'intro_header_1' },
    { sel: '.hero-kicker', id: 'intro_header_1', field: 'kicker' },
    { sel: '.hero-subline', id: 'intro_hero_lead', field: 'text' },
    { sel: '.ghost-outline-type', id: 'intro_ghost_bg' },
    { sel: '.vertical-marginalia', id: 'intro_marginalia' },
    { sel: '.editorial-stamp', id: 'intro_stamp' },
    { sel: '#about .about-lead', id: 'about_lead', field: 'text' },
    { sel: '#about .about-body', id: 'about_body', field: 'text' },
    { sel: '#about .about-chip-group', id: 'about_chip_group' },
    { sel: '#about .creatives-showcase', id: 'about_creatives_showcase' },
    { sel: '#about .cred-block', id: 'about_credentials' },
    { sel: '#about .contact-cluster', id: 'about_contact_cluster' },
    { sel: '#stack .stack-grid', id: 'stack_frontend' },
    { sel: '#more .more-grid', id: 'more_links' },
    { sel: '#more .profile-meta-block', id: 'more_profile_meta' }
  ];

  map.forEach(({ sel, id, field }) => {
    const el = document.querySelector(sel);
    if (el) {
      el.setAttribute('data-content-id', id);
      if (field) el.setAttribute('data-field', field);
    }
  });
}

function syncAnnotatedElements(state) {
  if (!state || !state.sections) return;
  state.sections.forEach(sec => {
    (sec.items || []).forEach(item => {
      const el = document.querySelector(`[data-content-id="${item.id}"]`);
      if (el) {
        if (item.visible === false) {
          el.style.opacity = '0.35';
          el.setAttribute('data-hidden-item', 'true');
        } else {
          el.style.opacity = '';
          el.removeAttribute('data-hidden-item');
        }

        const fields = item.fields || {};
        Object.keys(fields).forEach(key => {
          const fieldEl = el.querySelector(`[data-field="${key}"]`) || (el.getAttribute('data-field') === key ? el : null);
          if (fieldEl && typeof fields[key] === 'string') {
            fieldEl.textContent = fields[key];
          }
        });
      }
    });
  });
}

/**
 * Render Project Cards with Prominent Tech Tags & Dedicated Arrow Container
 */
function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const sec = store.getSection('projects');
  const items = sec && sec.items ? sec.items : null;
  if (items && items.length > 0) {
    const isEditMode = document.body.classList.contains('view-render-active') || document.body.classList.contains('view-edit-active');
    const displayItems = isEditMode ? items : items.filter(it => it.visible !== false);
    container.innerHTML = displayItems.map(it => {
      const reg = COMPONENT_REGISTRY[it.type];
      return reg ? reg.renderPublic(it) : '';
    }).join('');
    return;
  }

  // Fallback to static PROJECTS
  container.innerHTML = PROJECTS.map((p) => {
    const attachedPhoto = getAttachedPhoto(`card_photo_${p.id}`);
    return `
      <article class="project-card hud-frame" data-content-id="${p.id}" data-detail-type="projects" data-detail-id="${p.id}" data-cursor="view" data-tilt>
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

  const sec = store.getSection('achievements');
  const items = sec && sec.items ? sec.items : null;
  if (items && items.length > 0) {
    const isEditMode = document.body.classList.contains('view-render-active') || document.body.classList.contains('view-edit-active');
    const displayItems = isEditMode ? items : items.filter(it => it.visible !== false);
    container.innerHTML = displayItems.map(it => {
      const reg = COMPONENT_REGISTRY[it.type];
      return reg ? reg.renderPublic(it) : '';
    }).join('');
    return;
  }

  container.innerHTML = ACHIEVEMENTS.map((a, idx) => `
    <div class="achievement-card hud-frame" data-content-id="${a.id}" data-detail-type="achievements" data-detail-id="${a.id}" data-cursor="view" data-tilt>
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

  const sec = store.getSection('experience');
  const items = sec && sec.items ? sec.items : null;
  if (items && items.length > 0) {
    const isEditMode = document.body.classList.contains('view-render-active') || document.body.classList.contains('view-edit-active');
    const displayItems = isEditMode ? items : items.filter(it => it.visible !== false);
    container.innerHTML = displayItems.map(it => {
      const reg = COMPONENT_REGISTRY[it.type];
      return reg ? reg.renderPublic(it) : '';
    }).join('');
    return;
  }

  container.innerHTML = EXPERIENCE.map((e, idx) => `
    <div class="experience-item hud-frame" data-content-id="${e.id}" data-detail-type="experience" data-detail-id="${e.id}" data-cursor="view" data-tilt>
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

