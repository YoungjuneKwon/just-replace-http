# Installation Guide

## How to Install the Extension

1. **Download or Clone the Repository**
   ```bash
   git clone https://github.com/YoungjuneKwon/just-replace-http.git
   ```

2. **Open Chrome Extensions Page**
   - Open Google Chrome browser
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `just-replace-http` folder
   - The extension should now appear in your extensions list

5. **Pin the Extension (Optional)**
   - Click the Extensions icon (puzzle piece) in the Chrome toolbar
   - Find "Just Replace HTTP" and click the pin icon

## Verifying Installation

After installation, you should see:
- The "Just Replace HTTP" icon in your Chrome toolbar (if pinned)
- The extension listed in `chrome://extensions/`
- Status should show "On" with a green toggle

## Using the Extension

1. **Click the Extension Icon**
   - Click the "Just Replace HTTP" icon in your toolbar
   - The popup window will appear

2. **Add a Pattern**
   - Enter a regex pattern in "원본 패턴 (정규식)"
   - Enter the replacement string in "대체 문자열 ($1 사용 가능)"
   - Click "추가" button

3. **Manage Patterns**
   - Toggle checkbox to enable/disable a pattern
   - Click "삭제" to remove a pattern

## Example Patterns

### Change API Domain
```
원본 패턴: https://api\.example\.com/(.*)
대체 문자열: https://api.newdomain.com/$1
```

### Redirect Old Path to New Path
```
원본 패턴: https://example\.com/old-path/(.*)
대체 문자열: https://example.com/new-path/$1
```

### Modify Query Parameters
```
원본 패턴: (https://example\.com/.*)\?version=old
대체 문자열: $1?version=new
```

## Troubleshooting

### Extension Not Working
1. Make sure the pattern is enabled (checkbox is checked)
2. Verify the regex pattern is valid
3. Check if the URL matches your pattern
4. Try disabling and re-enabling the extension

### Pattern Not Matching
1. Test your regex pattern using a regex tester
2. Remember to escape special characters (e.g., `\.` for literal dots)
3. Ensure the pattern matches the complete URL

### Cannot Add Pattern
- Error message will appear if:
  - Pattern or replacement is empty
  - Regex pattern is invalid

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Just Replace HTTP"
3. Click "Remove"
4. Confirm removal

## Data Storage

- All patterns are stored in your browser's IndexedDB
- Data persists across browser sessions
- Data is local to your browser (not synced)
- Removing the extension will delete all stored patterns
