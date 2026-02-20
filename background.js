// Background service worker for HTTP request interception
// Using declarativeNetRequest API for request modification

let patterns = [];
const RULE_ID_OFFSET = 1000;

// Initialize on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Just Replace HTTP extension installed');
  loadPatternsAndUpdateRules();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updatePatterns') {
    patterns = message.patterns || [];
    updateDeclarativeNetRequestRules();
  }
});

// Load patterns from IndexedDB on startup
async function loadPatternsAndUpdateRules() {
  try {
    const db = await openDatabase();
    patterns = await getAllPatterns(db);
    updateDeclarativeNetRequestRules();
  } catch (error) {
    console.error('Error loading patterns:', error);
    // Update badge even on error to reflect actual state
    updateBadge();
  }
}

// Open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JustReplaceHTTP', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('patterns')) {
        const objectStore = db.createObjectStore('patterns', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('enabled', 'enabled', { unique: false });
      }
    };
  });
}

// Get all patterns from IndexedDB
function getAllPatterns(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['patterns'], 'readonly');
    const objectStore = transaction.objectStore('patterns');
    const request = objectStore.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Update badge to show active status
function updateBadge() {
  const enabledPatterns = patterns.filter(p => p.enabled);
  
  if (enabledPatterns.length > 0) {
    // Show badge with count of enabled patterns
    chrome.action.setBadgeText({ text: enabledPatterns.length.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' }); // Green color
    chrome.action.setTitle({ title: chrome.i18n.getMessage('badgeTitleActive', [enabledPatterns.length.toString()]) });
  } else {
    // Clear badge when no patterns are enabled
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setTitle({ title: 'Just Replace HTTP' });
  }
}

// Update declarativeNetRequest rules
async function updateDeclarativeNetRequestRules() {
  try {
    // Remove all existing dynamic rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);
    
    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds
      });
    }

    // Create new rules from enabled patterns
    const enabledPatterns = patterns.filter(p => p.enabled);
    
    if (enabledPatterns.length === 0) {
      console.log('No enabled patterns to apply');
      updateBadge();
      return;
    }

    // Create redirect rules for URL modifications
    const newRules = enabledPatterns.map((pattern, index) => {
      // Create a rule for URL redirection with regex
      return {
        id: RULE_ID_OFFSET + index,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: convertPatternToRegexSubstitution(pattern.target)
          }
        },
        condition: {
          regexFilter: pattern.origin,
          resourceTypes: [
            'main_frame',
            'sub_frame',
            'stylesheet',
            'script',
            'image',
            'font',
            'object',
            'xmlhttprequest',
            'ping',
            'csp_report',
            'media',
            'websocket',
            'webtransport',
            'webbundle',
            'other'
          ]
        }
      };
    });

    // Add new rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules
    });

    console.log(`Updated declarativeNetRequest rules: ${newRules.length} rules added`);
    
    updateBadge();
  } catch (error) {
    console.log('Error updating declarativeNetRequest rules:', error);
    // Update badge even on error to reflect current state
    updateBadge();
  }
}

// Convert user pattern to regex substitution format
function convertPatternToRegexSubstitution(target) {
  // The target pattern can use $1, $2, etc. for group references
  // declarativeNetRequest uses \1, \2, etc., so we need to convert
  return target.replace(/\$(\d+)/g, '\\$1');
}

// Load patterns on startup
loadPatternsAndUpdateRules();
