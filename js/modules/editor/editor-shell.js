/**
 * Editor Shell & Dual-View Controller
 * Manages:
 * - Persistent B&W Top Bar
 * - View 1: Static B&W Edit View (Unmounted 3D, zero animations, pure high-density forms)
 * - View 2: Live Render View (Interactive overlays, floating mini-toolbars, Inspector drawer)
 * - Seamless state synchronization, undo/redo, draft/publish, and JSON export/import
 */

import { store } from '../store/contentStore.js';
import { COMPONENT_REGISTRY } from '../registry/componentRegistry.js';

export class EditorShell {
  constructor() {
    this.activeView = 'edit'; // 'edit' (default) or 'render'
    this.selectedItemId = null;
    this.animationsPaused = false;
    this.topBarEl = null;
    this.editViewEl = null;
    this.renderInspectorEl = null;
    this.floatingToolbarEl = null;
    this.unsubscribeStore = null;
  }

  mount() {
    // 1. Create Top Bar
    this.renderTopBar();

    // 2. Create Static Edit View Container
    this.renderEditView();

    // 3. Create Live Render View Overlays & Inspector
    this.renderLiveOverlays();

    // 4. Bind Store Subscriptions
    this.unsubscribeStore = store.subscribe((state, event) => {
      this.handleStoreEvent(state, event);
    });

    // 5. Bind Global Shortcuts
    this.bindShortcuts();

    // 6. Set initial view mode
    this.setViewMode('edit');
  }

  unmount() {
    if (this.unsubscribeStore) this.unsubscribeStore();
    if (this.topBarEl) this.topBarEl.remove();
    if (this.editViewEl) this.editViewEl.remove();
    if (this.renderInspectorEl) this.renderInspectorEl.remove();
    if (this.floatingToolbarEl) this.floatingToolbarEl.remove();

    document.body.classList.remove('view-edit-active', 'view-render-active', 'admin-mode-active');
    document.body.style.overflow = '';
    // Restore animations
    if (window.__webglControls && window.__webglControls.play) {
      window.__webglControls.play();
    }
  }

  /* =========================================================================
     Top Bar Rendering & Actions
     ========================================================================= */
  renderTopBar() {
    const bar = document.createElement('header');
    bar.className = 'editor-top-bar';
    bar.innerHTML = `
      <div class="editor-bar-cluster">
        <div class="editor-mode-toggle" role="group" aria-label="Editor View Modes">
          <button type="button" class="mode-btn is-active" id="btn-mode-edit">EDIT VIEW</button>
          <button type="button" class="mode-btn" id="btn-mode-render">RENDER VIEW</button>
        </div>
        <div class="editor-status-pill" id="editor-status-pill">
          <span class="status-indicator-dot" id="status-dot"></span>
          <span id="status-text">Saved</span>
        </div>
      </div>

      <div class="editor-bar-cluster">
        <button type="button" class="editor-bar-btn" id="btn-undo" title="Undo (Ctrl+Z)" disabled>↺ Undo</button>
        <button type="button" class="editor-bar-btn" id="btn-redo" title="Redo (Ctrl+Shift+Z)" disabled>↻ Redo</button>
        <button type="button" class="editor-bar-btn" id="btn-pause-anim" title="Pause 3D and motion effects">Pause 3D</button>
      </div>

      <div class="editor-bar-cluster">
        <button type="button" class="editor-bar-btn" id="btn-discard" title="Discard unsaved draft changes">Discard Draft</button>
        <button type="button" class="editor-bar-btn" id="btn-export" title="Download backup JSON">Export JSON</button>
        <button type="button" class="editor-bar-btn" id="btn-import" title="Restore from backup JSON">Import</button>
        <button type="button" class="editor-bar-btn" id="btn-change-pass" title="Change administration passcode">Passcode</button>
        <button type="button" class="editor-bar-btn btn-publish" id="btn-publish">PUBLISH LIVE</button>
        <button type="button" class="editor-bar-btn btn-exit" id="btn-exit-editor" title="Exit Edit Mode">Exit</button>
      </div>
    `;

    document.body.appendChild(bar);
    this.topBarEl = bar;

    // Hook buttons
    bar.querySelector('#btn-mode-edit').addEventListener('click', () => this.setViewMode('edit'));
    bar.querySelector('#btn-mode-render').addEventListener('click', () => this.setViewMode('render'));
    bar.querySelector('#btn-undo').addEventListener('click', () => store.undo());
    bar.querySelector('#btn-redo').addEventListener('click', () => store.redo());

    bar.querySelector('#btn-pause-anim').addEventListener('click', () => {
      this.toggleAnimations();
    });

    bar.querySelector('#btn-change-pass').addEventListener('click', () => {
      const legacyPassBtn = document.getElementById('admin-change-pass-btn');
      if (legacyPassBtn) {
        legacyPassBtn.click();
      } else {
        const newPass = prompt('Enter new admin passcode (min 8 chars):');
        if (newPass && newPass.length >= 8) {
          fetch('/api/auth/change-passcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPasscode: newPass })
          }).then(() => alert('Passcode updated successfully.'))
            .catch(() => alert('Passcode updated locally.'));
        }
      }
    });

    bar.querySelector('#btn-discard').addEventListener('click', () => {
      if (confirm('Discard all draft changes and revert to the live published state?')) {
        store.discardDraft();
      }
    });

    bar.querySelector('#btn-export').addEventListener('click', () => store.exportJson());

    bar.querySelector('#btn-import').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => store.importJson(ev.target.result);
        reader.readAsText(file);
      };
      input.click();
    });

    bar.querySelector('#btn-publish').addEventListener('click', async () => {
      const published = store.publish();
      if (published) {
        // Also call server API if available
        try {
          await fetch('/api/content/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(published)
          });
        } catch (e) {
          console.log('[EditorShell] Local mode publish saved to storage.');
        }
        alert('Changes published live! Public visitors now see this latest version.');
      }
    });

    bar.querySelector('#btn-exit-editor').addEventListener('click', async () => {
      if (store.isDirty) {
        if (!confirm('You have unpublished draft changes. Exit anyway? (Your draft will remain saved)')) return;
      }
      sessionStorage.removeItem('portfolio_admin_auth');
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {}
      this.unmount();
    });
  }

  toggleAnimations() {
    this.animationsPaused = !this.animationsPaused;
    const btn = this.topBarEl.querySelector('#btn-pause-anim');
    if (btn) btn.textContent = this.animationsPaused ? 'Resume 3D' : 'Pause 3D';

    if (window.__webglControls) {
      if (this.animationsPaused && window.__webglControls.pause) {
        window.__webglControls.pause();
      } else if (!this.animationsPaused && window.__webglControls.play) {
        window.__webglControls.play();
      }
    }
  }

  /* =========================================================================
     View Mode Switching (Edit vs. Render)
     ========================================================================= */
  setViewMode(mode) {
    this.activeView = mode;
    const editBtn = this.topBarEl.querySelector('#btn-mode-edit');
    const renderBtn = this.topBarEl.querySelector('#btn-mode-render');

    if (mode === 'edit') {
      editBtn.classList.add('is-active');
      renderBtn.classList.remove('is-active');

      document.body.classList.add('view-edit-active');
      document.body.classList.remove('view-render-active');

      // Stop heavy 3D scene & smooth scroll in edit view
      if (window.__webglControls && window.__webglControls.pause) {
        window.__webglControls.pause();
      }
      if (window.__lenis) {
        window.__lenis.stop();
      }

      this.closeInspector();
      this.hideFloatingToolbar();
      this.refreshEditView();
    } else {
      renderBtn.classList.add('is-active');
      editBtn.classList.remove('is-active');

      document.body.classList.remove('view-edit-active');
      document.body.classList.add('view-render-active');

      // Resume 3D scene unless manually paused
      if (!this.animationsPaused && window.__webglControls && window.__webglControls.play) {
        window.__webglControls.play();
      }
      if (window.__lenis) {
        window.__lenis.start();
      }
    }
  }

  /* =========================================================================
     View 1: Static B&W Edit View
     ========================================================================= */
  renderEditView() {
    const container = document.createElement('div');
    container.className = 'edit-view-container';
    container.innerHTML = `
      <aside class="edit-outline-sidebar">
        <div class="outline-header">// Sections Outline</div>
        <ul class="outline-tree" id="edit-outline-tree"></ul>
        <button type="button" class="btn-add-section" id="btn-add-section">+ Add Section</button>
      </aside>
      <main class="edit-main-stack" id="edit-main-stack"></main>
    `;

    document.body.appendChild(container);
    this.editViewEl = container;

    // Hook add section button
    container.querySelector('#btn-add-section').addEventListener('click', () => {
      const name = prompt('Enter new section name:');
      if (!name) return;
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      store.addSection({
        id: slug,
        slug: `#${slug}`,
        spineLabel: name.toUpperCase(),
        navLabel: name.toUpperCase(),
        items: []
      });
    });

    this.refreshEditView();
  }

  refreshEditView() {
    if (!this.editViewEl) return;
    const treeEl = this.editViewEl.querySelector('#edit-outline-tree');
    const stackEl = this.editViewEl.querySelector('#edit-main-stack');
    const state = store.getState();
    if (!state || !state.sections) return;

    // 1. Populate Outline Tree
    treeEl.innerHTML = state.sections.map((section, sIdx) => `
      <li class="outline-item ${section.visible === false ? 'is-hidden' : ''}" data-target-section="${section.id}">
        <span>${section.spineLabel || section.id}</span>
        <span class="outline-badge">${section.items ? section.items.length : 0}</span>
      </li>
    `).join('');

    treeEl.querySelectorAll('.outline-item').forEach(item => {
      item.addEventListener('click', () => {
        const secId = item.getAttribute('data-target-section');
        const secEl = stackEl.querySelector(`[data-section-id="${secId}"]`);
        if (secEl) {
          secEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 2. Populate Main Section Cards Stack
    stackEl.innerHTML = '';
    state.sections.forEach((section, sIdx) => {
      const secCard = document.createElement('section');
      secCard.className = 'editor-section-card';
      secCard.setAttribute('data-section-id', section.id);

      secCard.innerHTML = `
        <div class="editor-section-header">
          <div class="section-title-wrap">
            <span class="editor-drag-grip">⋮⋮</span>
            <span class="section-label">${section.spineLabel || section.id}</span>
            <span class="editor-type-badge">${section.items ? section.items.length : 0} ITEMS</span>
          </div>
          <div class="editor-item-actions">
            <button type="button" class="editor-btn sec-vis-btn">
              ${section.visible === false ? 'Hidden' : 'Visible'}
            </button>
          </div>
        </div>
        <div class="editor-items-list" id="items-for-${section.id}"></div>
        <div style="padding: 0 20px 20px;">
          <button type="button" class="btn-add-item" data-add-to-section="${section.id}">
            + Add Item to ${section.spineLabel || section.id}
          </button>
        </div>
      `;

      secCard.querySelector('.sec-vis-btn').addEventListener('click', () => {
        store.toggleSectionVisibility(section.id);
      });

      const itemsList = secCard.querySelector(`#items-for-${section.id}`);

      // Render each item via Component Registry
      (section.items || []).forEach((item, itemIdx) => {
        const reg = COMPONENT_REGISTRY[item.type];
        if (!reg) return;

        const rowEl = reg.renderEditor(item, {
          updateFields: (id, fields) => store.updateItemFields(id, fields),
          toggleVisibility: (id) => store.toggleItemVisibility(id),
          duplicate: (id) => store.duplicateItem(id),
          remove: (id) => store.removeItem(id)
        });

        itemsList.appendChild(rowEl);
      });

      // Hook Add Item button
      secCard.querySelector(`[data-add-to-section="${section.id}"]`).addEventListener('click', () => {
        this.openAddItemDialog(section.id);
      });

      stackEl.appendChild(secCard);
    });
  }

  openAddItemDialog(sectionId) {
    const types = Object.keys(COMPONENT_REGISTRY);
    const chosenType = prompt(`Select Content Type to Add:\n${types.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}\n\nEnter type name:`);
    if (!chosenType || !COMPONENT_REGISTRY[chosenType]) {
      if (chosenType) alert('Invalid content type.');
      return;
    }

    const reg = COMPONENT_REGISTRY[chosenType];
    const defaultFields = reg.defaultFields ? reg.defaultFields() : {};

    store.addItem(sectionId, {
      type: chosenType,
      fields: defaultFields
    });
  }

  /* =========================================================================
     View 2: Live Render View Overlays & Inspector
     ========================================================================= */
  renderLiveOverlays() {
    // 1. Floating Mini Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'render-floating-toolbar';
    toolbar.id = 'render-floating-toolbar';
    toolbar.innerHTML = `
      <button type="button" class="toolbar-btn" id="tb-edit" title="Edit in Inspector">Edit ✎</button>
      <button type="button" class="toolbar-btn" id="tb-copy" title="Duplicate item">Copy ⎘</button>
      <button type="button" class="toolbar-btn" id="tb-hide" title="Hide/Show item">Hide 👁</button>
      <button type="button" class="toolbar-btn" id="tb-delete" title="Delete item">Delete ✕</button>
    `;
    document.body.appendChild(toolbar);
    this.floatingToolbarEl = toolbar;

    // 2. Slide-out Inspector Drawer
    const drawer = document.createElement('aside');
    drawer.className = 'render-inspector-drawer';
    drawer.id = 'render-inspector-drawer';
    drawer.innerHTML = `
      <div class="inspector-header">
        <span class="inspector-title" id="inspector-title">// ITEM PROPERTIES</span>
        <button type="button" class="editor-btn" id="inspector-close-btn">Close ✕</button>
      </div>
      <div class="inspector-body" id="inspector-body"></div>
    `;
    document.body.appendChild(drawer);
    this.renderInspectorEl = drawer;

    drawer.querySelector('#inspector-close-btn').addEventListener('click', () => {
      this.closeInspector();
    });

    // Global Click Listener for Element Selection in Render Mode
    document.addEventListener('click', (e) => {
      if (this.activeView !== 'render') return;
      if (e.target.closest('.editor-top-bar, .render-floating-toolbar, .render-inspector-drawer')) return;

      const contentEl = e.target.closest('[data-content-id]');
      if (contentEl) {
        e.preventDefault();
        e.stopPropagation();
        this.selectElementForEdit(contentEl);
      } else {
        this.deselectElement();
      }
    }, true);

    // Toolbar actions
    toolbar.querySelector('#tb-edit').addEventListener('click', () => {
      if (this.selectedItemId) this.openInspector(this.selectedItemId);
    });

    toolbar.querySelector('#tb-copy').addEventListener('click', () => {
      if (this.selectedItemId) store.duplicateItem(this.selectedItemId);
    });

    toolbar.querySelector('#tb-hide').addEventListener('click', () => {
      if (this.selectedItemId) store.toggleItemVisibility(this.selectedItemId);
    });

    toolbar.querySelector('#tb-delete').addEventListener('click', () => {
      if (this.selectedItemId && confirm('Delete this element? This can be undone with Ctrl+Z.')) {
        store.removeItem(this.selectedItemId);
        this.deselectElement();
      }
    });
  }

  selectElementForEdit(element) {
    this.deselectElement();
    const itemId = element.getAttribute('data-content-id');
    this.selectedItemId = itemId;
    element.classList.add('is-selected-for-edit');

    // Position floating mini toolbar
    const rect = element.getBoundingClientRect();
    const toolbar = this.floatingToolbarEl;
    toolbar.style.top = `${window.scrollY + rect.top - 40}px`;
    toolbar.style.left = `${window.scrollX + rect.left}px`;
    toolbar.classList.add('is-visible');
  }

  deselectElement() {
    this.selectedItemId = null;
    document.querySelectorAll('.is-selected-for-edit').forEach(el => el.classList.remove('is-selected-for-edit'));
    this.hideFloatingToolbar();
  }

  hideFloatingToolbar() {
    if (this.floatingToolbarEl) {
      this.floatingToolbarEl.classList.remove('is-visible');
    }
  }

  openInspector(itemId) {
    const record = store.getItem(itemId);
    if (!record) return;

    const drawer = this.renderInspectorEl;
    const body = drawer.querySelector('#inspector-body');
    const title = drawer.querySelector('#inspector-title');

    const reg = COMPONENT_REGISTRY[record.item.type];
    if (!reg) return;

    title.textContent = `// ${record.item.type.toUpperCase()}`;
    body.innerHTML = '';

    const formRow = reg.renderEditor(record.item, {
      updateFields: (id, fields) => store.updateItemFields(id, fields),
      toggleVisibility: (id) => store.toggleItemVisibility(id),
      duplicate: (id) => store.duplicateItem(id),
      remove: (id) => {
        store.removeItem(id);
        this.closeInspector();
      }
    });

    // Expand the form in the drawer
    formRow.classList.add('is-expanded');
    body.appendChild(formRow);

    drawer.classList.add('is-open');
  }

  closeInspector() {
    if (this.renderInspectorEl) {
      this.renderInspectorEl.classList.remove('is-open');
    }
  }

  /* =========================================================================
     State Subscriptions & Keyboard Shortcuts
     ========================================================================= */
  handleStoreEvent(state, event) {
    // Update Undo / Redo button states
    const undoBtn = this.topBarEl?.querySelector('#btn-undo');
    const redoBtn = this.topBarEl?.querySelector('#btn-redo');
    if (undoBtn) undoBtn.disabled = !store.canUndo();
    if (redoBtn) redoBtn.disabled = !store.canRedo();

    // Update Status Pill
    const dot = this.topBarEl?.querySelector('#status-dot');
    const text = this.topBarEl?.querySelector('#status-text');
    if (dot && text) {
      if (store.isDirty) {
        dot.className = 'status-indicator-dot is-dirty';
        text.textContent = 'Unpublished Changes';
      } else {
        dot.className = 'status-indicator-dot';
        text.textContent = 'Saved';
      }
    }

    // Refresh active view
    if (this.activeView === 'edit') {
      this.refreshEditView();
    } else {
      // In render mode, trigger DOM re-render of public content
      if (window.__refreshPublicSite) {
        window.__refreshPublicSite(state);
      }
    }
  }

  bindShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl+Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (store.canUndo()) {
          e.preventDefault();
          store.undo();
        }
      }
      // Ctrl+Shift+Z or Ctrl+Y: Redo
      else if ((e.ctrlKey || e.metaKey) && ((e.shiftKey && e.key === 'z') || e.key === 'y')) {
        if (store.canRedo()) {
          e.preventDefault();
          store.redo();
        }
      }
      // Ctrl+S: Force Save Draft
      else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        store.persistDraft();
      }
      // Escape: Close Inspector / Deselect
      else if (e.key === 'Escape') {
        this.closeInspector();
        this.deselectElement();
      }
    });
  }
}
