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
          objectStore.createIndex('name', 'name', { unique: false });
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
    document.getElementById('exportBtn').addEventListener('click', () => this.exportPatterns());
    document.getElementById('importBtn').addEventListener('click', () => this.importPatterns());
    document.getElementById('importFile').addEventListener('change', (e) => this.handleImportFile(e));
    
    // Allow Enter key to add pattern
    document.getElementById('originPattern').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addPattern();
    });
    document.getElementById('targetPattern').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addPattern();
    });
    document.getElementById('patternName').addEventListener('keypress', (e) => {
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
          ${pattern.name ? `<div class="pattern-name">${this.escapeHtml(pattern.name)}</div>` : ''}
          <div class="pattern-row">
            <span class="pattern-origin">${this.escapeHtml(pattern.origin)}</span>
            <span class="pattern-arrow">=&gt;</span>
            <span class="pattern-target">${this.escapeHtml(pattern.target)}</span>
          </div>
        </div>
        <button class="copy-btn" data-id="${pattern.id}">복사</button>
        <button class="delete-btn" data-id="${pattern.id}">삭제</button>
      </div>
    `).join('');

    // Attach event listeners to pattern items
    patternsList.querySelectorAll('.pattern-toggle').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => this.togglePattern(parseInt(e.target.dataset.id)));
    });

    patternsList.querySelectorAll('.copy-btn').forEach(button => {
      button.addEventListener('click', (e) => this.copyPattern(parseInt(e.target.dataset.id)));
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
    const nameInput = document.getElementById('patternName');
    const originInput = document.getElementById('originPattern');
    const targetInput = document.getElementById('targetPattern');

    const name = nameInput.value.trim();
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
      name: name || null,
      origin,
      target,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    await this.db.addPattern(pattern);
    await this.loadPatterns();

    // Clear inputs
    nameInput.value = '';
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

  async copyPattern(id) {
    const pattern = this.patterns.find(p => p.id === id);
    if (!pattern) return;

    // Populate input fields with pattern data
    document.getElementById('patternName').value = pattern.name || '';
    document.getElementById('originPattern').value = pattern.origin;
    document.getElementById('targetPattern').value = pattern.target;
    
    // Focus on the name field for easy editing
    document.getElementById('patternName').focus();
  }

  async exportPatterns() {
    if (this.patterns.length === 0) {
      alert('내보낼 패턴이 없습니다.');
      return;
    }

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      patterns: this.patterns.map(({ id, ...pattern }) => pattern)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `just-replace-http-patterns-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importPatterns() {
    document.getElementById('importFile').click();
  }

  async handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.patterns || !Array.isArray(importData.patterns)) {
        throw new Error('유효하지 않은 파일 형식입니다.');
      }

      let importedCount = 0;
      for (const pattern of importData.patterns) {
        if (pattern.origin && pattern.target) {
          // Validate regex
          try {
            new RegExp(pattern.origin);
            
            const newPattern = {
              name: pattern.name || null,
              origin: pattern.origin,
              target: pattern.target,
              enabled: pattern.enabled !== undefined ? pattern.enabled : true,
              createdAt: new Date().toISOString()
            };

            await this.db.addPattern(newPattern);
            importedCount++;
          } catch (e) {
            console.warn('Invalid regex pattern skipped:', pattern.origin, e.message);
          }
        }
      }

      await this.loadPatterns();
      alert(`${importedCount}개의 패턴을 성공적으로 가져왔습니다.`);
      
      // Clear file input
      event.target.value = '';
    } catch (error) {
      alert('파일 가져오기 실패: ' + error.message);
      event.target.value = '';
    }
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
