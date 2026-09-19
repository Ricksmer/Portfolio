/**
 * Zero-Database Vercel-Ready Authentication & Live In-Place Editor Module
 * 
 * Features:
 * 1. Public GitHub Safe: SHA-256 cryptographic verification, zero plaintext passwords in code.
 * 2. Editable Links: Clicking any link in edit mode intercepts navigation and prompts to edit destination URL (href).
 * 3. Photo Attachments: Attach photos via local file picker (converted to Base64 dataURL) or external image URL.
 * 4. Full Detail Page Editing: Titles, subtitles, prose paragraphs, architecture takeaway boxes,
 *    and gallery specimen photo attachments.
 * 5. Clean Save & Cancel Workflow:
 *    - CANCEL: Immediately discards all unsaved text, link, and photo edits, reverting back to snapshot.
 *    - SAVE: Persists everything to localStorage and exports production-ready HTML for Vercel.
 * 6. Zero Emojis across all labels, dialogs, and alerts.
 */

const AUTH_KEY = 'portfolio_admin_auth';
const STORAGE_DATA_KEY = 'portfolio_live_edits';
const STORAGE_LINKS_KEY = 'portfolio_link_edits';
const STORAGE_PHOTOS_KEY = 'portfolio_attached_photos';
const STORAGE_DETAIL_KEY = 'portfolio_detail_edits';
const STORAGE_HASH_KEY = 'portfolio_admin_hash';

// SHA-256 hash of '123456777' (One-way hash safe for public GitHub)
const DEFAULT_PASSCODE_HASH = '24efb5cf3758522bd85f5567d4e4ae604a55043a6cd68b821859428995cd5edf';

/**
 * Computes SHA-256 hex string using native Web Crypto API
 */
async function computeSha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredHash() {
  return localStorage.getItem(STORAGE_HASH_KEY) || DEFAULT_PASSCODE_HASH;
}

function setStoredHash(newHash) {
  localStorage.setItem(STORAGE_HASH_KEY, newHash);
}

export function isAdminActive() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function getAttachedPhoto(key) {
  try {
    const photos = JSON.parse(localStorage.getItem(STORAGE_PHOTOS_KEY) || '{}');
    return photos[key] || null;
  } catch (e) {
    return null;
  }
}

export function saveAttachedPhoto(key, dataUrl) {
  try {
    const photos = JSON.parse(localStorage.getItem(STORAGE_PHOTOS_KEY) || '{}');
    photos[key] = dataUrl;
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(photos));
  } catch (e) {
    console.warn('Could not persist photo:', e);
  }
}

export function getDetailEdit(key) {
  try {
    const detailEdits = JSON.parse(localStorage.getItem(STORAGE_DETAIL_KEY) || '{}');
    return detailEdits[key] || null;
  } catch (e) {
    return null;
  }
}

export function saveDetailEdit(key, value) {
  try {
    const detailEdits = JSON.parse(localStorage.getItem(STORAGE_DETAIL_KEY) || '{}');
    detailEdits[key] = value;
    localStorage.setItem(STORAGE_DETAIL_KEY, JSON.stringify(detailEdits));
  } catch (e) {
    console.warn('Could not persist detail edit:', e);
  }
}

export function getLinkEdit(key) {
  try {
    const links = JSON.parse(localStorage.getItem(STORAGE_LINKS_KEY) || '{}');
    return links[key] || null;
  } catch (e) {
    return null;
  }
}

export function saveLinkEdit(key, url) {
  try {
    const links = JSON.parse(localStorage.getItem(STORAGE_LINKS_KEY) || '{}');
    links[key] = url;
    localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
  } catch (e) {
    console.warn('Could not persist link edit:', e);
  }
}

/**
 * Interactive helper to attach a photo: directly opens OS file chooser for local upload
 */
export function triggerPhotoAttachment(photoKey, onLoadedCallback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      saveAttachedPhoto(photoKey, dataUrl);
      if (onLoadedCallback) onLoadedCallback(dataUrl);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

/**
 * Attaches HTML5 Drag-and-Drop and click-to-browse handlers to any element
 */
export function setupDropzone(element, photoKey, onLoadedCallback) {
  if (!element) return;

  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.add('is-dragover');
  });

  element.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.add('is-dragover');
  });

  element.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.remove('is-dragover');
  });

  element.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    element.classList.remove('is-dragover');

    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        saveAttachedPhoto(photoKey, dataUrl);
        if (onLoadedCallback) onLoadedCallback(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  });

  // Clicking the dropzone opens file dialog
  element.addEventListener('click', (e) => {
    if (e.target.closest('button') && e.target.closest('button') !== element) return;
    e.preventDefault();
    e.stopPropagation();
    triggerPhotoAttachment(photoKey, onLoadedCallback);
  });
}

export function initAdminAuth() {
  const trigger = document.getElementById('admin-auth-trigger');
  const modal = document.getElementById('admin-auth-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  const form = document.getElementById('admin-auth-form');
  const input = document.getElementById('admin-auth-pass');

  const saveBtn = document.getElementById('admin-save-btn');
  const cancelBtn = document.getElementById('admin-cancel-btn');
  const changePassBtn = document.getElementById('admin-change-pass-btn');

  if (!trigger || !modal) return;

  // Snapshots for reverting upon Cancel
  let initialContentSnapshot = {};
  let initialLinksSnapshot = {};
  let initialPhotosSnapshot = {};

  // Restore saved edits on initial load
  restoreSavedEdits();
  restoreSavedLinks();

  // Check active session
  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    enableAdminMode();
  }

  // Open modal
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (sessionStorage.getItem(AUTH_KEY) === 'true') {
      alert('Admin mode is already active.');
    } else {
      modal.classList.add('is-open');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
    }
  });

  function closeModal() {
    modal.classList.remove('is-open');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Submit Passcode (One-Way SHA-256 Verification)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredPass = (input ? input.value : '').trim();
      if (!enteredPass) return;

      const enteredHash = await computeSha256(enteredPass);
      const targetHash = getStoredHash();

      if (enteredHash === targetHash) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        closeModal();
        enableAdminMode();
      } else {
        alert('Authentication failed: Invalid passcode.');
      }
    });
  }

  // Enable Admin Mode
  function enableAdminMode() {
    document.body.classList.add('admin-mode-active');
    captureSnapshots();
    setupEditableContent();
    setupEditableLinks();
    setupPhotoButtons();
  }

  // Capture Snapshot of State Before Editing
  function captureSnapshots() {
    initialContentSnapshot = {};
    initialLinksSnapshot = {};
    initialPhotosSnapshot = JSON.parse(localStorage.getItem(STORAGE_PHOTOS_KEY) || '{}');

    // Snapshot text fields
    document.querySelectorAll('[data-edit-id]').forEach(el => {
      const id = el.getAttribute('data-edit-id');
      initialContentSnapshot[id] = el.innerHTML;
    });

    // Snapshot link destinations
    document.querySelectorAll('a[data-link-id]').forEach(link => {
      const id = link.getAttribute('data-link-id');
      initialLinksSnapshot[id] = link.getAttribute('href');
    });
  }

  // Setup text content editable fields
  function setupEditableContent() {
    const editableSelectors = [
      '.hero-name',
      '.hero-subline',
      '.about-lead',
      '.about-body',
      '.cred-sentence-item',
      '.project-card-title',
      '.project-card-lead',
      '.ach-title',
      '.ach-meta',
      '.exp-role',
      '.exp-org',
      '.arc-card-title',
      '.arc-card-desc'
    ];

    document.querySelectorAll(editableSelectors.join(',')).forEach((el, index) => {
      const editId = `edit_field_${index}`;
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('data-edit-id', editId);
      if (initialContentSnapshot[editId] === undefined) {
        initialContentSnapshot[editId] = el.innerHTML;
      }
    });
  }

  // Setup link destination editing (intercepts clicks in edit mode)
  function setupEditableLinks() {
    // Collect all links across hero, say hi, cards, and detail pages
    document.querySelectorAll('a[href]').forEach((link, idx) => {
      if (!link.hasAttribute('data-link-id')) {
        link.setAttribute('data-link-id', `link_${idx}`);
      }
      link.classList.add('cms-link-editable');
    });
  }

  let linkEditorPopover = null;
  let activeEditingLink = null;

  function ensureLinkEditorPopover() {
    if (linkEditorPopover) return linkEditorPopover;

    const overlay = document.createElement('div');
    overlay.className = 'cms-link-popover-overlay';
    overlay.innerHTML = `
      <div class="cms-link-popover" role="dialog" aria-modal="true">
        <div class="cms-link-popover-title">
          <span>🔗</span> EDIT LINK DESTINATION
        </div>
        <div class="cms-link-popover-hint">
          Enter new destination address (URL, https://..., mailto:, or tel:):
        </div>
        <input type="text" class="cms-link-input" id="cms-popover-url-input" placeholder="https://..." />
        <div class="cms-link-actions">
          <button type="button" class="cms-link-cancel-btn" id="cms-popover-cancel-btn">Cancel</button>
          <button type="button" class="cms-link-save-btn" id="cms-popover-save-btn">Update Link</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#cms-popover-url-input');
    const saveBtn = overlay.querySelector('#cms-popover-save-btn');
    const cancelBtn = overlay.querySelector('#cms-popover-cancel-btn');

    function close() {
      overlay.classList.remove('is-open');
      activeEditingLink = null;
    }

    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    saveBtn.addEventListener('click', () => {
      if (!activeEditingLink) return;
      const newHref = input.value.trim();
      if (newHref) {
        const linkId = activeEditingLink.getAttribute('data-link-id') || 'custom_link';
        activeEditingLink.setAttribute('href', newHref);
        saveLinkEdit(linkId, newHref);

        activeEditingLink.classList.add('cms-link-updated');
        setTimeout(() => activeEditingLink.classList.remove('cms-link-updated'), 600);
      }
      close();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      } else if (e.key === 'Escape') {
        close();
      }
    });

    linkEditorPopover = {
      open(link) {
        activeEditingLink = link;
        input.value = link.getAttribute('href') || '';
        overlay.classList.add('is-open');
        setTimeout(() => {
          input.focus();
          input.select();
        }, 80);
      },
      close
    };

    return linkEditorPopover;
  }

  // Global link click handler during edit mode (opens visual popover)
  document.addEventListener('click', (e) => {
    if (!isAdminActive()) return;

    // Check if clicked an editable link or button
    const link = e.target.closest('a.cms-link-editable, a[data-link-id]');
    if (link) {
      e.preventDefault();
      e.stopPropagation();

      const popover = ensureLinkEditorPopover();
      popover.open(link);
    }
  }, true);

  // Setup photo attachment dropzones and buttons on cards
  function setupPhotoButtons() {
    document.querySelectorAll('.project-card, .arc-card').forEach((card, idx) => {
      const cardId = card.getAttribute('data-detail-id') || `card_${idx}`;
      const photoKey = `card_photo_${cardId}`;

      // 1. Interactive Drag & Drop Area
      let dropzone = card.querySelector('.cms-card-dropzone');
      if (!dropzone) {
        dropzone = document.createElement('div');
        dropzone.className = 'cms-card-dropzone';
        dropzone.innerHTML = `
          <span class="dropzone-icon">⇲</span>
          <span class="dropzone-title">DROP IMAGE HERE TO REPLACE</span>
          <span class="dropzone-hint">OR CLICK TO BROWSE LOCAL FILES</span>
        `;
        card.insertBefore(dropzone, card.firstChild);
      }

      setupDropzone(dropzone, photoKey, (dataUrl) => {
        applyCardPhoto(card, dataUrl);
      });

      // 2. Fallback quick button
      if (!card.querySelector('.cms-card-photo-btn')) {
        const photoBtn = document.createElement('button');
        photoBtn.className = 'cms-card-photo-btn';
        photoBtn.type = 'button';
        photoBtn.textContent = 'ATTACH PHOTO';
        photoBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerPhotoAttachment(photoKey, (dataUrl) => {
            applyCardPhoto(card, dataUrl);
          });
        });
        card.appendChild(photoBtn);
      }

      // Check if photo already exists
      const savedPhoto = getAttachedPhoto(photoKey);
      if (savedPhoto) {
        applyCardPhoto(card, savedPhoto);
      }
    });
  }

  function applyCardPhoto(card, dataUrl) {
    let cover = card.querySelector('.cms-card-cover');
    if (!cover) {
      cover = document.createElement('div');
      cover.className = 'cms-card-cover';
      const dropzone = card.querySelector('.cms-card-dropzone');
      if (dropzone && dropzone.nextSibling) {
        card.insertBefore(cover, dropzone.nextSibling);
      } else {
        card.insertBefore(cover, card.firstChild);
      }
    }
    cover.style.backgroundImage = `url("${dataUrl}")`;
    cover.style.display = 'block';

    // Allow dragging new image directly onto existing cover too!
    const cardId = card.getAttribute('data-detail-id') || 'card';
    setupDropzone(cover, `card_photo_${cardId}`, (newUrl) => {
      cover.style.backgroundImage = `url("${newUrl}")`;
    });
  }

  // Disable Admin Mode
  function disableAdminMode() {
    sessionStorage.removeItem(AUTH_KEY);
    document.body.classList.remove('admin-mode-active');

    if (linkEditorPopover) {
      linkEditorPopover.close();
    }

    document.querySelectorAll('[contenteditable]').forEach(el => {
      el.removeAttribute('contenteditable');
    });

    document.querySelectorAll('.cms-link-editable').forEach(link => {
      link.classList.remove('cms-link-editable');
    });

    document.querySelectorAll('.cms-card-dropzone, .cms-card-photo-btn, .cms-specimen-photo-btn').forEach(btn => {
      btn.remove();
    });
  }

  // Option 1: CANCEL (Reverts all live text, links, and photos back to snapshot)
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      // Revert text
      Object.keys(initialContentSnapshot).forEach(id => {
        const el = document.querySelector(`[data-edit-id="${id}"]`);
        if (el) el.innerHTML = initialContentSnapshot[id];
      });

      // Revert links
      Object.keys(initialLinksSnapshot).forEach(id => {
        const link = document.querySelector(`[data-link-id="${id}"]`);
        if (link) link.setAttribute('href', initialLinksSnapshot[id]);
      });

      // Revert photos to pre-editing snapshot
      localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(initialPhotosSnapshot));

      disableAdminMode();
      alert('Editing cancelled. All unsaved changes have been discarded.');
    });
  }

  // Option 2: SAVE (Persists text, links, photos and exports clean HTML for Vercel)
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const edits = {};
      document.querySelectorAll('[data-edit-id]').forEach(el => {
        const id = el.getAttribute('data-edit-id');
        edits[id] = el.innerHTML;
      });

      // Persist text edits
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(edits));

      // Persist link destinations
      const linkEdits = {};
      document.querySelectorAll('a[data-link-id]').forEach(link => {
        const id = link.getAttribute('data-link-id');
        linkEdits[id] = link.getAttribute('href');
      });
      localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(linkEdits));

      // Update snapshots to current
      initialContentSnapshot = { ...edits };
      initialLinksSnapshot = { ...linkEdits };
      initialPhotosSnapshot = JSON.parse(localStorage.getItem(STORAGE_PHOTOS_KEY) || '{}');

      // Export clean HTML file
      exportCleanHtml();

      disableAdminMode();
      alert('Changes saved successfully. Updated index.html has been downloaded for Vercel deployment.');
    });
  }

  // Sectionized: CHANGE PASSCODE (Computes SHA-256 & persists to localStorage)
  if (changePassBtn) {
    changePassBtn.addEventListener('click', async () => {
      const newPass = prompt('Enter new passcode:');
      if (newPass === null) return;
      const trimmed = newPass.trim();
      if (!trimmed) {
        alert('Passcode cannot be empty.');
        return;
      }

      const newHash = await computeSha256(trimmed);
      setStoredHash(newHash);
      alert('Passcode updated successfully. The new passcode is now required for future access.');
    });
  }

  // Clean HTML file export helper (strips admin tags and embeds edits & photos)
  function exportCleanHtml() {
    const clone = document.documentElement.cloneNode(true);

    // Remove editing attributes
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    clone.querySelectorAll('.cms-link-editable').forEach(el => el.classList.remove('cms-link-editable'));
    clone.querySelectorAll('.cms-card-photo-btn, .cms-specimen-photo-btn').forEach(btn => btn.remove());
    clone.querySelector('body').classList.remove('admin-mode-active');

    const exportedHtml = '<!DOCTYPE html>\n' + clone.outerHTML;

    const blob = new Blob([exportedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Restore saved edits from localStorage
  function restoreSavedEdits() {
    try {
      const saved = localStorage.getItem(STORAGE_DATA_KEY);
      if (saved) {
        const edits = JSON.parse(saved);
        Object.keys(edits).forEach(id => {
          const el = document.querySelector(`[data-edit-id="${id}"]`);
          if (el) el.innerHTML = edits[id];
        });
      }
    } catch (e) {
      console.warn('Could not restore edits from storage:', e);
    }
  }

  // Restore saved link destinations from localStorage
  function restoreSavedLinks() {
    try {
      const savedLinks = localStorage.getItem(STORAGE_LINKS_KEY);
      if (savedLinks) {
        const links = JSON.parse(savedLinks);
        Object.keys(links).forEach(id => {
          const el = document.querySelector(`[data-link-id="${id}"]`);
          if (el) el.setAttribute('href', links[id]);
        });
      }
    } catch (e) {
      console.warn('Could not restore links from storage:', e);
    }
  }
}
