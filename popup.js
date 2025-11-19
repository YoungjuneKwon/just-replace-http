// IndexedDB helper class
class PatternDB {
  constructor() {
    this.dbName = 'JustReplaceHTTP';
    this.storeName = 'patterns';
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          objectStore.createIndex('enabled', 'enabled', { unique: false });
        }
      };
    });
  }

  async getAllPatterns() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addPattern(pattern) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(pattern);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updatePattern(id, pattern) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put({ ...pattern, id });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deletePattern(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// UI Controller
class PopupController {
  constructor() {
    this.db = new PatternDB();
    this.patterns = [];
  }

  async init() {
    await this.db.init();
    await this.loadPatterns();
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('addPattern').addEventListener('click', () => this.addPattern());
    
    // Allow Enter key to add pattern
    document.getElementById('originPattern').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addPattern();
    });
    document.getElementById('targetPattern').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addPattern();
    });
  }

  async loadPatterns() {
    this.patterns = await this.db.getAllPatterns();
    this.renderPatterns();
    this.notifyBackgroundUpdate();
  }

  renderPatterns() {
    const patternsList = document.getElementById('patternsList');
    const noPatterns = document.getElementById('noPatterns');

    if (this.patterns.length === 0) {
      patternsList.style.display = 'none';
      noPatterns.style.display = 'block';
      return;
    }

    patternsList.style.display = 'flex';
    noPatterns.style.display = 'none';

    patternsList.innerHTML = this.patterns.map(pattern => `
      <div class="pattern-item ${!pattern.enabled ? 'disabled' : ''}" data-id="${pattern.id}">
        <input type="checkbox" 
               class="pattern-toggle" 
               data-id="${pattern.id}" 
               ${pattern.enabled ? 'checked' : ''}>
        <div class="pattern-content">
          <span class="pattern-origin">${this.escapeHtml(pattern.origin)}</span>
          <span class="pattern-arrow">=&gt;</span>
          <span class="pattern-target">${this.escapeHtml(pattern.target)}</span>
        </div>
        <button class="delete-btn" data-id="${pattern.id}">삭제</button>
      </div>
    `).join('');

    // Attach event listeners to pattern items
    patternsList.querySelectorAll('.pattern-toggle').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => this.togglePattern(parseInt(e.target.dataset.id)));
    });

    patternsList.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => this.deletePattern(parseInt(e.target.dataset.id)));
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async addPattern() {
    const originInput = document.getElementById('originPattern');
    const targetInput = document.getElementById('targetPattern');

    const origin = originInput.value.trim();
    const target = targetInput.value.trim();

    if (!origin || !target) {
      alert('원본 패턴과 대체 문자열을 모두 입력해주세요.');
      return;
    }

    // Validate regex
    try {
      new RegExp(origin);
    } catch (e) {
      alert('유효하지 않은 정규식입니다: ' + e.message);
      return;
    }

    const pattern = {
      origin,
      target,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    await this.db.addPattern(pattern);
    await this.loadPatterns();

    // Clear inputs
    originInput.value = '';
    targetInput.value = '';
    originInput.focus();
  }

  async togglePattern(id) {
    const pattern = this.patterns.find(p => p.id === id);
    if (!pattern) return;

    pattern.enabled = !pattern.enabled;
    await this.db.updatePattern(id, pattern);
    await this.loadPatterns();
  }

  async deletePattern(id) {
    if (!confirm('이 패턴을 삭제하시겠습니까?')) return;

    await this.db.deletePattern(id);
    await this.loadPatterns();
  }

  notifyBackgroundUpdate() {
    // Notify background script to update rules
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: 'updatePatterns', patterns: this.patterns });
    }
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  const controller = new PopupController();
  await controller.init();
});
