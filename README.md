# Just Replace HTTP

A Chrome extension that replaces parts of HTTP request strings with desired strings before sending the request.

## Key Features

- **Settings UI**: A popup UI for easy pattern management
- **IndexedDB Storage**: Safely stores settings in the browser's IndexedDB
- **HTTP Request Monitoring**: Monitors all HTTP requests and transforms URLs according to configured patterns
- **Regex Support**: Regex pattern matching and group references ($1, $2, etc.)
- **On/Off Toggle**: Enable/disable each pattern individually
- **Active Status Badge**: Displays the number of active patterns as a badge on the extension icon, so you can confirm replacement is active without opening the popup
- **Pattern Naming**: Assign names to patterns for easy identification and management (optional)
- **Copy Feature**: Copy an existing pattern to the input fields with one click for editing
- **Export/Import**: Export or import the pattern list as a JSON file
- **Free**: Provides Requestly-style replace functionality for free
- **Multi-language Support**: UI language automatically adapts to your Chrome browser language (English, French, Spanish, Arabic, Chinese, Russian, Korean)

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the downloaded folder

## How to Use

### Adding a Pattern

1. Click the extension icon in the Chrome toolbar
2. In the "Add New Pattern" section:
   - **Pattern Name**: Enter a name to identify the pattern (optional)
   - **Source Pattern**: Enter a regex pattern (e.g. `https://old-domain\.com/(.*)`)
   - **Replacement String**: Enter the replacement string (e.g. `https://new-domain.com/$1`)
3. Click the "Add" button

### Managing Patterns

- **On/Off Toggle**: Click the checkbox to enable/disable a pattern
- **Copy**: Click the "Copy" button to copy a pattern to the input fields for editing
- **Delete Pattern**: Click the "Delete" button to remove a pattern
- **Export**: Click the "Export" button to save all patterns as a JSON file
- **Import**: Click the "Import" button to load patterns from a JSON file
- **Check Active Status**: The green badge number on the extension icon shows the count of currently active patterns

### Regex Examples

#### Domain Change
```
Source pattern: https://api\.example\.com/(.*)
Replacement string: https://api.newdomain.com/$1
```

#### Path Change
```
Source pattern: https://example\.com/old-path/(.*)
Replacement string: https://example.com/new-path/$1
```

#### Query Parameter Change
```
Source pattern: (https://example\.com/.*)\?old=(.*)
Replacement string: $1?new=$2
```

## Tech Stack

- **Manifest V3**: Uses the latest Chrome Extension API
- **IndexedDB**: Persistent storage for pattern data
- **declarativeNetRequest API**: Efficient HTTP request modification
- **Vanilla JavaScript**: No external library dependencies
- **Chrome i18n API**: Multi-language support using Chrome's built-in internationalization

## File Structure

```
just-replace-http/
├── manifest.json         # Extension configuration
├── popup.html            # Popup UI structure
├── popup.css             # Popup styles
├── popup.js              # Popup logic and IndexedDB management
├── background.js         # Background service worker (HTTP request interception)
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── _locales/             # i18n message files
    ├── en/messages.json  # English (default)
    ├── fr/messages.json  # French
    ├── es/messages.json  # Spanish
    ├── ar/messages.json  # Arabic
    ├── zh_CN/messages.json # Chinese (Simplified)
    ├── ru/messages.json  # Russian
    └── ko/messages.json  # Korean
```

## Permissions

- **declarativeNetRequest**: Required to intercept and modify HTTP requests
- **declarativeNetRequestWithHostAccess**: Permission to modify requests for all hosts
- **storage**: Required to store pattern data in IndexedDB
- **host_permissions (all_urls)**: Required to handle requests for all URLs

## Notes

- Regex patterns must be valid JavaScript regular expressions
- Invalid patterns will not be added, and an error message will be displayed
- Pattern changes take effect immediately
- Be careful with overly broad patterns, as they may unintentionally modify requests

## Changelog

### v1.2.0
- 🌐 **Multi-language support**: UI automatically adapts to the browser language (English, French, Spanish, Arabic, Chinese, Russian, Korean)
- 🔧 **i18n**: All UI messages are now managed via Chrome's i18n API

### v1.1.0 (2025-01-25)
- ✨ **Pattern Naming**: Assign names to patterns for easy identification and management (optional)
- ✨ **Copy Feature**: Copy an existing pattern to input fields with one click
- ✨ **Export/Import**: Export or import pattern list as a JSON file
- 🔧 **UI Improvements**: Improved pattern list UI and new feature buttons
- 🐛 **Stability**: Improved IndexedDB schema and stability

### v1.0.0
- 🎉 Initial release
- HTTP request string replacement
- Regex pattern support
- On/Off toggle

## License

MIT License

## Contributing

Issues and pull requests are always welcome!
