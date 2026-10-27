/**
 * Unified Content Store & State Management Engine
 * Single Source of Truth for Public Site, Render View, and Edit View
 * 
 * Features:
 * - Reactive subscription model (pub/sub)
 * - Complete undo/redo history stack (up to 50 snapshots)
 * - Draft vs. Published change tracking
 * - Local storage fallback for local dev / offline usage
 * - Full JSON Export / Import
 */

const STORAGE_DRAFT_KEY = 'portfolio_content_draft';
const STORAGE_PUBLISHED_KEY = 'portfolio_content_published';
const STORAGE_HISTORY_KEY = 'portfolio_version_history';

class ContentStore {
  constructor() {
    this.state = null;
    this.publishedBaseline = null;
    this.subscribers = new Set();
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;
    this.isDirty = false;
    this.saveDebounceTimer = null;
  }

  /**
   * Initializes store by loading published or draft data
   */
  async init() {
    try {
      // 1. Check for draft in localStorage first (if admin was editing)
      const cachedDraft = localStorage.getItem(STORAGE_DRAFT_KEY);
      const cachedPublished = localStorage.getItem(STORAGE_PUBLISHED_KEY);

      // 2. Fetch master static JSON as baseline
      const res = await fetch('./js/data/content.json');
      const baseData = await res.json();

      this.publishedBaseline = cachedPublished ? JSON.parse(cachedPublished) : baseData;
      this.state = cachedDraft ? JSON.parse(cachedDraft) : JSON.parse(JSON.stringify(this.publishedBaseline));

      // Push initial state to history stack
      this.history = [JSON.parse(JSON.stringify(this.state))];
      this.historyIndex = 0;
      this.checkDirty();
      this.notify();
      return this.state;
    } catch (err) {
      console.error('[ContentStore] Initialization failed, falling back to local snapshot:', err);
      return null;
    }
  }

  /**
   * Subscribe to store updates
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event = { type: 'CHANGE' }) {
    for (const callback of this.subscribers) {
      try {
        callback(this.state, event);
      } catch (e) {
        console.error('[ContentStore] Subscriber error:', e);
      }
    }
  }

  getState() {
    return this.state;
  }

  getSection(sectionId) {
    if (!this.state || !this.state.sections) return null;
    return this.state.sections.find(s => s.id === sectionId) || null;
  }

  getItem(itemId) {
    if (!this.state || !this.state.sections) return null;
    for (const section of this.state.sections) {
      const item = section.items.find(i => i.id === itemId);
      if (item) return { item, section };
    }
    return null;
  }

  /**
   * Record state snapshot to undo stack
   */
  _pushSnapshot() {
    // If we're not at end of history stack, truncate future
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    this.history.push(JSON.parse(JSON.stringify(this.state)));
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    this.checkDirty();
    this._queueAutosave();
  }

  _queueAutosave() {
    clearTimeout(this.saveDebounceTimer);
    this.saveDebounceTimer = setTimeout(() => {
      this.persistDraft();
    }, 600);
  }

  persistDraft() {
    if (!this.state) return;
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(this.state));
      this.notify({ type: 'DRAFT_SAVED' });
    } catch (e) {
      console.warn('[ContentStore] Local draft save warning:', e);
    }
  }

  checkDirty() {
    if (!this.state || !this.publishedBaseline) {
      this.isDirty = false;
      return false;
    }
    this.isDirty = JSON.stringify(this.state) !== JSON.stringify(this.publishedBaseline);
    return this.isDirty;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  undo() {
    if (!this.canUndo()) return;
    this.historyIndex--;
    this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    this.checkDirty();
    this._queueAutosave();
    this.notify({ type: 'UNDO' });
  }

  redo() {
    if (!this.canRedo()) return;
    this.historyIndex++;
    this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    this.checkDirty();
    this._queueAutosave();
    this.notify({ type: 'REDO' });
  }

  /**
   * Updates fields of a specific content item
   */
  updateItemFields(itemId, newFields) {
    const record = this.getItem(itemId);
    if (!record) return false;

    record.item.fields = { ...record.item.fields, ...newFields };
    record.item.updatedAt = new Date().toISOString();
    this._pushSnapshot();
    this.notify({ type: 'ITEM_UPDATED', itemId });
    return true;
  }

  /**
   * Directly sets a specific nested field value
   */
  setItemField(itemId, fieldPath, value) {
    const record = this.getItem(itemId);
    if (!record) return false;

    const parts = fieldPath.split('.');
    let target = record.item.fields;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!target[parts[i]]) target[parts[i]] = {};
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = value;
    record.item.updatedAt = new Date().toISOString();

    this._pushSnapshot();
    this.notify({ type: 'ITEM_FIELD_UPDATED', itemId, fieldPath, value });
    return true;
  }

  /**
   * Toggle visibility of an item
   */
  toggleItemVisibility(itemId) {
    const record = this.getItem(itemId);
    if (!record) return false;

    record.item.visible = !record.item.visible;
    this._pushSnapshot();
    this.notify({ type: 'ITEM_VISIBILITY_TOGGLED', itemId, visible: record.item.visible });
    return true;
  }

  /**
   * Adds a new item to a section
   */
  addItem(sectionId, itemData) {
    const section = this.getSection(sectionId);
    if (!section) return null;

    const newItem = {
      id: itemData.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: itemData.type,
      sectionId,
      order: section.items.length + 1,
      visible: true,
      fields: itemData.fields || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    section.items.push(newItem);
    this._pushSnapshot();
    this.notify({ type: 'ITEM_ADDED', sectionId, item: newItem });
    return newItem;
  }

  /**
   * Duplicate an existing item
   */
  duplicateItem(itemId) {
    const record = this.getItem(itemId);
    if (!record) return null;

    const { item, section } = record;
    const index = section.items.indexOf(item);

    const clonedItem = JSON.parse(JSON.stringify(item));
    clonedItem.id = `${item.id}-copy-${Math.random().toString(36).substr(2, 4)}`;
    if (clonedItem.fields.name) clonedItem.fields.name += ' (Copy)';
    else if (clonedItem.fields.title) clonedItem.fields.title += ' (Copy)';

    section.items.splice(index + 1, 0, clonedItem);
    // Re-index orders
    section.items.forEach((it, idx) => { it.order = idx + 1; });

    this._pushSnapshot();
    this.notify({ type: 'ITEM_DUPLICATED', itemId: clonedItem.id });
    return clonedItem;
  }

  /**
   * Removes an item (undoable)
   */
  removeItem(itemId) {
    const record = this.getItem(itemId);
    if (!record) return false;

    const { item, section } = record;
    const index = section.items.indexOf(item);
    section.items.splice(index, 1);
    // Re-index orders
    section.items.forEach((it, idx) => { it.order = idx + 1; });

    this._pushSnapshot();
    this.notify({ type: 'ITEM_REMOVED', itemId });
    return true;
  }

  /**
   * Move item within section
   */
  reorderItem(sectionId, fromIndex, toIndex) {
    const section = this.getSection(sectionId);
    if (!section) return false;
    if (fromIndex < 0 || fromIndex >= section.items.length) return false;
    if (toIndex < 0 || toIndex >= section.items.length) return false;

    const [moved] = section.items.splice(fromIndex, 1);
    section.items.splice(toIndex, 0, moved);
    section.items.forEach((it, idx) => { it.order = idx + 1; });

    this._pushSnapshot();
    this.notify({ type: 'ITEM_REORDERED', sectionId, fromIndex, toIndex });
    return true;
  }

  /**
   * Add a new section
   */
  addSection(sectionData) {
    if (!this.state || !this.state.sections) return null;

    const newSection = {
      id: sectionData.id || `section-${Date.now()}`,
      slug: sectionData.slug || `#${sectionData.id}`,
      spineLabel: sectionData.spineLabel || 'NEW SECTION',
      navLabel: sectionData.navLabel || 'SECTION',
      order: this.state.sections.length + 1,
      visible: true,
      items: sectionData.items || []
    };

    this.state.sections.push(newSection);
    this._pushSnapshot();
    this.notify({ type: 'SECTION_ADDED', section: newSection });
    return newSection;
  }

  /**
   * Toggle visibility of an entire section
   */
  toggleSectionVisibility(sectionId) {
    const section = this.getSection(sectionId);
    if (!section) return false;

    section.visible = !section.visible;
    this._pushSnapshot();
    this.notify({ type: 'SECTION_VISIBILITY_TOGGLED', sectionId, visible: section.visible });
    return true;
  }

  /**
   * Discards current draft and resets to published state
   */
  discardDraft() {
    if (!this.publishedBaseline) return;
    this.state = JSON.parse(JSON.stringify(this.publishedBaseline));
    localStorage.removeItem(STORAGE_DRAFT_KEY);
    this.history = [JSON.parse(JSON.stringify(this.state))];
    this.historyIndex = 0;
    this.checkDirty();
    this.notify({ type: 'DRAFT_DISCARDED' });
  }

  /**
   * Promotes draft to published (creates historical snapshot for rollback)
   */
  publish() {
    if (!this.state) return;

    this.state.lastPublishedAt = new Date().toISOString();
    this.state.version = (this.state.version || 1) + 1;

    // Save snapshot to history list
    this._archiveVersionSnapshot(this.publishedBaseline);

    // Baseline becomes current state
    this.publishedBaseline = JSON.parse(JSON.stringify(this.state));
    localStorage.setItem(STORAGE_PUBLISHED_KEY, JSON.stringify(this.publishedBaseline));
    localStorage.removeItem(STORAGE_DRAFT_KEY);

    this.checkDirty();
    this.notify({ type: 'PUBLISHED' });
    return this.publishedBaseline;
  }

  _archiveVersionSnapshot(snapshot) {
    if (!snapshot) return;
    try {
      const historyList = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY) || '[]');
      historyList.unshift({
        timestamp: new Date().toISOString(),
        version: snapshot.version || 1,
        data: snapshot
      });
      // Keep up to 10 versions
      if (historyList.length > 10) historyList.pop();
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(historyList));
    } catch (e) {
      console.warn('[ContentStore] Version archive error:', e);
    }
  }

  getVersionHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  rollbackToVersion(index) {
    const historyList = this.getVersionHistory();
    if (!historyList[index]) return false;

    const targetSnapshot = historyList[index].data;
    this.state = JSON.parse(JSON.stringify(targetSnapshot));
    this._pushSnapshot();
    this.notify({ type: 'ROLLBACK', version: targetSnapshot.version });
    return true;
  }

  /**
   * JSON Export: Download immutable backup file
   */
  exportJson() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `portfolio-content-v${this.state.version || 1}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /**
   * JSON Import: Validates and loads content into draft state
   */
  importJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error('Invalid format: missing sections array');
      }
      this.state = parsed;
      this._pushSnapshot();
      this.notify({ type: 'IMPORTED' });
      return true;
    } catch (err) {
      console.error('[ContentStore] Import failed:', err);
      alert('Import failed: ' + err.message);
      return false;
    }
  }
}

// Global Singleton Store Instance
export const store = new ContentStore();
