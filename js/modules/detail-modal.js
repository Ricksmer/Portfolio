/**
 * Detail Page View Controller
 * Implements full-screen dedicated page experience with deep linking
 * and complete Admin In-Place Editing (text, links, and photo attachments)
 */
import { PROJECTS } from '../data/projects.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { EXPERIENCE } from '../data/experience.js';
import {
  isAdminActive,
  getAttachedPhoto,
  triggerPhotoAttachment,
  getDetailEdit,
  saveDetailEdit
} from './admin-auth.js';

const DATA_MAP = {
  projects: PROJECTS,
  achievements: ACHIEVEMENTS,
  experience: EXPERIENCE
};

export function initDetailModal() {
  const pageView = document.getElementById('detail-page-view');
  const backBtn = document.getElementById('detail-back-btn');
  const breadcrumbCategory = document.getElementById('detail-breadcrumb-category');
  const breadcrumbTitle = document.getElementById('detail-breadcrumb-title');
  const contentArea = document.getElementById('detail-page-content');

  if (!pageView || !contentArea) return;

  function renderFullPage(category, item) {
    let categoryName = 'PROJECTS';
    let title = '';
    let meta = '';
    let body = item.body || [];
    let imageCount = item.images || 2;
    let tags = item.tags || [];

    if (category === 'projects') {
      categoryName = 'PROJECTS';
      title = item.name;
      meta = `${item.kicker} · ${tags.join(' · ')}`;
    } else if (category === 'achievements') {
      categoryName = 'ACHIEVEMENTS';
      title = item.title;
      meta = `${item.year} · ${item.meta}`;
    } else if (category === 'experience') {
      categoryName = 'EXPERIENCE';
      title = item.role;
      meta = `${item.org} · ${item.period}`;
    }

    // Check for saved custom edits from localStorage
    const savedTitle = getDetailEdit(`detail_${category}_${item.id}_title`);
    if (savedTitle) title = savedTitle;

    const savedMeta = getDetailEdit(`detail_${category}_${item.id}_meta`);
    if (savedMeta) meta = savedMeta;

    const savedTakeawayTitle = getDetailEdit(`detail_${category}_${item.id}_takeaway_title`) || '// KEY TAKEAWAY & ARCHITECTURE';
    const savedTakeawayBody = getDetailEdit(`detail_${category}_${item.id}_takeaway_body`) || 'Designed with strict separation of concerns, defensive runtime error handling, and a high-contrast brutalist design language for effortless clarity.';

    if (breadcrumbCategory) breadcrumbCategory.textContent = categoryName;
    if (breadcrumbTitle) breadcrumbTitle.textContent = title;

    const adminMode = isAdminActive();

    // Specimen mockup frames (supports photo attachments)
    let galleryHtml = '';
    for (let i = 1; i <= Math.max(2, imageCount); i++) {
      const photoKey = `photo_${category}_${item.id}_slot_${i}`;
      const attachedPhoto = getAttachedPhoto(photoKey);

      galleryHtml += `
        <div class="detail-specimen-frame" data-photo-key="${photoKey}">
          ${attachedPhoto ? `
            <img src="${attachedPhoto}" class="detail-specimen-img" alt="Attached Specimen 0${i}">
          ` : `
            <span>// ASSET SPECIMEN 0${i} [HIGH-RES RENDER]</span>
          `}
          ${adminMode ? `
            <button type="button" class="cms-specimen-photo-btn" data-photo-slot="${photoKey}">
              ${attachedPhoto ? 'REPLACE PHOTO' : 'ATTACH PHOTO'}
            </button>
          ` : ''}
        </div>
      `;
    }

    contentArea.innerHTML = `
      <div class="detail-header-block">
        <div class="detail-page-tag">// ${categoryName} — DETAILED SPECIFICATION</div>
        <h1 class="detail-page-title" ${adminMode ? `contenteditable="true" data-edit-id="detail_${category}_${item.id}_title"` : ''}>${title}</h1>
        <div class="detail-page-meta" ${adminMode ? `contenteditable="true" data-edit-id="detail_${category}_${item.id}_meta"` : ''}>${meta}</div>
      </div>

      <div class="detail-gallery">
        ${galleryHtml}
      </div>

      <div class="detail-main-layout">
        <div class="detail-prose">
          ${body.map((p, pIdx) => {
            const savedP = getDetailEdit(`detail_${category}_${item.id}_p_${pIdx}`) || p;
            return `<p ${adminMode ? `contenteditable="true" data-edit-id="detail_${category}_${item.id}_p_${pIdx}"` : ''}>${savedP}</p>`;
          }).join('')}
          <div style="margin-top: 32px; padding: 24px; border: 1px solid var(--line); border-radius: var(--radius); background: rgba(255,255,255,0.02);">
            <div class="detail-takeaway-title" style="font-family: var(--font-m); font-size: 11px; color: var(--iris-a); margin-bottom: 8px;" ${adminMode ? `contenteditable="true" data-edit-id="detail_${category}_${item.id}_takeaway_title"` : ''}>${savedTakeawayTitle}</div>
            <p class="detail-takeaway-body" style="font-size: 14px; margin: 0; color: var(--fg-dim);" ${adminMode ? `contenteditable="true" data-edit-id="detail_${category}_${item.id}_takeaway_body"` : ''}>
              ${savedTakeawayBody}
            </p>
          </div>
        </div>

        <aside class="detail-sidebar">
          <div class="detail-sidebar-box">
            <div class="detail-sidebar-title">// CORE METRIC & ROLE</div>
            <div style="font-size: 14px; color: var(--fg); margin-bottom: 8px;">
              <b class="detail-role-lead" ${adminMode ? `contenteditable="true" data-edit-id="detail_${category}_${item.id}_role_lead"` : ''}>Lead Developer &amp; Designer</b>
            </div>
            <div class="detail-role-status" style="font-size: 12px; color: var(--fg-faint); font-family: var(--font-m);" ${adminMode ? `contenteditable="true" data-edit-id="detail_${category}_${item.id}_role_status"` : ''}>Status: Verified / Deployed</div>
          </div>

          ${tags.length ? `
            <div class="detail-sidebar-box">
              <div class="detail-sidebar-title">// TECH SPECIFICATION</div>
              <div class="detail-tags-cloud">
                ${tags.map(t => `<span class="p-tag">${t}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <div class="detail-sidebar-box">
            <div class="detail-sidebar-title">// EXTERNAL REPOSITORY</div>
            <a class="pill" href="https://github.com/Ricksmer" target="_blank" rel="noopener" style="width: 100%; justify-content: center;" data-link-id="detail_${category}_${item.id}_repo">
              <span class="k">GH</span>Open on GitHub ↗
            </a>
          </div>
        </aside>
      </div>
    `;

    // Hook photo attachment buttons inside detail page
    if (adminMode) {
      contentArea.querySelectorAll('.cms-specimen-photo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const photoKey = btn.getAttribute('data-photo-slot');
          const frame = btn.closest('.detail-specimen-frame');

          triggerPhotoAttachment(photoKey, (dataUrl) => {
            let img = frame.querySelector('.detail-specimen-img');
            if (!img) {
              img = document.createElement('img');
              img.className = 'detail-specimen-img';
              frame.insertBefore(img, btn);
            }
            img.src = dataUrl;
            btn.textContent = 'REPLACE PHOTO';
            const span = frame.querySelector('span');
            if (span) span.remove();
          });
        });
      });

      // Hook real-time saving on blur for detail editable fields
      contentArea.querySelectorAll('[data-edit-id]').forEach(el => {
        el.addEventListener('blur', () => {
          const id = el.getAttribute('data-edit-id');
          saveDetailEdit(id, el.innerHTML);
        });
      });
    }
  }

  function openPage(category, id, updateHistory = true) {
    const list = DATA_MAP[category];
    if (!list) return;

    const item = list.find(x => x.id === id);
    if (!item) return;

    renderFullPage(category, item);
    pageView.classList.add('is-open');
    pageView.scrollTop = 0;
    document.body.style.overflow = 'hidden';

    if (updateHistory) {
      history.pushState({ fullpage: `${category}-${id}` }, '', `#${category}-${id}`);
    }
  }

  function closePage(updateHistory = true) {
    pageView.classList.remove('is-open');
    document.body.style.overflow = '';

    if (updateHistory && location.hash) {
      history.pushState({}, '', window.location.pathname + window.location.search);
    }
  }

  // Click trigger binding
  document.addEventListener('click', (e) => {
    // If admin clicked a photo button, ignore card opening
    if (e.target.closest('.cms-card-photo-btn, .cms-specimen-photo-btn')) return;

    const trigger = e.target.closest('[data-detail-type][data-detail-id]');
    if (trigger) {
      e.preventDefault();
      const type = trigger.getAttribute('data-detail-type');
      const id = trigger.getAttribute('data-detail-id');
      openPage(type, id);
    }
  });

  // Back button
  if (backBtn) backBtn.addEventListener('click', () => closePage());

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pageView.classList.contains('is-open')) {
      closePage();
    }
  });

  // Browser back/forward navigation
  window.addEventListener('popstate', () => {
    if (pageView.classList.contains('is-open')) {
      closePage(false);
    } else if (location.hash) {
      checkInitialHash();
    }
  });

  // Deep linking check on initial page load
  function checkInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const parts = hash.split('-');
    if (parts.length >= 2) {
      const category = parts[0];
      const id = parts.slice(1).join('-');
      if (DATA_MAP[category]) {
        openPage(category, id, false);
      }
    }
  }

  checkInitialHash();
}
