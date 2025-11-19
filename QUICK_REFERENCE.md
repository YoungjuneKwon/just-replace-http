# Quick Reference Guide

## Common Use Cases

### 1. Change API Endpoint Domain

**Use Case**: Redirect all API calls from old domain to new domain

```
원본 패턴: https://old-api\.example\.com/(.*)
대체 문자열: https://new-api.example.com/$1
```

**Example**:
- Before: `https://old-api.example.com/v1/users`
- After: `https://new-api.example.com/v1/users`

### 2. Change API Version

**Use Case**: Update API version from v1 to v2

```
원본 패턴: https://api\.example\.com/v1/(.*)
대체 문자열: https://api.example.com/v2/$1
```

**Example**:
- Before: `https://api.example.com/v1/users/123`
- After: `https://api.example.com/v2/users/123`

### 3. Add Query Parameter

**Use Case**: Add a debug parameter to all requests

```
원본 패턴: (https://example\.com/[^?]*)(\?.*)?
대체 문자열: $1?debug=true$2
```

**Example**:
- Before: `https://example.com/page`
- After: `https://example.com/page?debug=true`

### 4. Change Protocol

**Use Case**: Force HTTPS for all HTTP requests

```
원본 패턴: http://(example\.com.*)
대체 문자열: https://$1
```

**Example**:
- Before: `http://example.com/page`
- After: `https://example.com/page`

### 5. Redirect Static Assets

**Use Case**: Use CDN for static assets

```
원본 패턴: https://example\.com/static/(.*)
대체 문자열: https://cdn.example.com/static/$1
```

**Example**:
- Before: `https://example.com/static/image.png`
- After: `https://cdn.example.com/static/image.png`

### 6. Environment Switch

**Use Case**: Switch from production to staging

```
원본 패턴: https://api\.example\.com/(.*)
대체 문자열: https://api-staging.example.com/$1
```

**Example**:
- Before: `https://api.example.com/users`
- After: `https://api-staging.example.com/users`

### 7. Path Rewrite

**Use Case**: Change old API path structure to new one

```
원본 패턴: https://api\.example\.com/api/v1/users/([^/]+)/profile
대체 문자열: https://api.example.com/v2/profiles/$1
```

**Example**:
- Before: `https://api.example.com/api/v1/users/123/profile`
- After: `https://api.example.com/v2/profiles/123`

## Regex Tips

### Escape Special Characters
- `.` → `\.` (literal dot)
- `?` → `\?` (literal question mark)
- `/` → `/` (no escape needed)
- `*` → `\*` (literal asterisk)

### Common Patterns
- `(.*)` - Capture everything
- `([^/]+)` - Capture until next slash
- `([^?]+)` - Capture until question mark
- `(\d+)` - Capture numbers only
- `([a-z]+)` - Capture lowercase letters

### Group References
- `$1` - First captured group
- `$2` - Second captured group
- `$3` - Third captured group
- etc.

## Best Practices

1. **Test Your Regex**: Use https://regex101.com to test patterns before adding
2. **Start Specific**: Begin with specific patterns and broaden if needed
3. **Use Groups Wisely**: Capture only what you need to reuse
4. **Order Matters**: More specific patterns should come first
5. **Toggle Don't Delete**: Disable patterns instead of deleting when debugging
6. **Backup Patterns**: Copy important patterns before making changes

## Troubleshooting

### Pattern Not Working?
1. ✅ Check if pattern is enabled (checkbox checked)
2. ✅ Verify regex syntax is correct
3. ✅ Ensure special characters are properly escaped
4. ✅ Test the pattern matches the actual URL
5. ✅ Check browser console for errors

### Unexpected Results?
1. ✅ Review pattern order - more specific patterns first
2. ✅ Check for overlapping patterns
3. ✅ Verify group references ($1, $2) are correct
4. ✅ Test with a single pattern enabled

### Performance Issues?
1. ✅ Reduce number of active patterns
2. ✅ Make patterns more specific
3. ✅ Avoid overly broad patterns like `(.*)` at start
