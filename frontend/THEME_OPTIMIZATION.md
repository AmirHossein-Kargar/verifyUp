# Dark Mode Theme Optimization

## Overview

The dark mode implementation has been optimized to provide a seamless user experience with persistent storage, no flash of incorrect theme (FOUC), and system preference detection.

## Key Features

### 1. Persistent Theme Storage

- Theme preference is stored in `localStorage` with key `color-theme`
- Values: `'dark'`, `'light'`, or `null` (system preference)
- Persists across browser sessions and page reloads

### 2. Flash Prevention (FOUC)

- Inline script in `layout.jsx` runs before React hydration
- Applies theme class to `<html>` element immediately
- Wrapped in IIFE with try-catch for error handling
- Fallback to system preference if localStorage fails

### 3. System Preference Detection

- Respects `prefers-color-scheme` media query on first visit
- Automatically updates when user changes system theme (only if no manual preference set)
- Graceful fallback for older browsers using `addListener`/`removeListener`

### 4. React State Synchronization

- Custom `useTheme` hook manages theme state
- Syncs with DOM state on mount to prevent hydration mismatches
- Provides `isDark`, `toggleTheme`, `setTheme`, and `mounted` state

## Implementation Details

### Files Modified

#### `frontend/src/app/layout.jsx`

- Enhanced inline script with IIFE and error handling
- Prevents flash of incorrect theme on initial load
- Runs before React hydration

```javascript
<script
  dangerouslySetInnerHTML={{
    __html: `
    (function() {
      try {
        var theme = localStorage.getItem('color-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (!theme && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
      }
    })();
  `,
  }}
/>
```

#### `frontend/src/hooks/useTheme.js` (New)

- Reusable custom hook for theme management
- Handles system preference changes
- Provides clean API for theme operations

**API:**

- `isDark`: Boolean indicating current theme
- `toggleTheme()`: Toggle between light and dark
- `setTheme(dark)`: Set specific theme
- `mounted`: Boolean indicating if component is mounted (prevents hydration issues)

#### `frontend/src/app/components/ThemeToggle.jsx`

- Refactored to use `useTheme` hook
- Cleaner, more maintainable code
- Same UI/UX, optimized logic

### Files Created

#### `frontend/src/hooks/useTheme.js`

Custom React hook for theme management with:

- localStorage persistence
- System preference detection
- Media query change listener
- Cross-browser compatibility

## Usage

### Using the Theme Toggle Component

```jsx
import ThemeToggle from "@/app/components/ThemeToggle";

// In your component
<ThemeToggle />;
```

### Using the useTheme Hook

```jsx
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { isDark, toggleTheme, setTheme, mounted } = useTheme();

  // Wait for mount to prevent hydration issues
  if (!mounted) return null;

  return (
    <div>
      <p>Current theme: {isDark ? "Dark" : "Light"}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme(true)}>Force Dark</button>
      <button onClick={() => setTheme(false)}>Force Light</button>
    </div>
  );
}
```

## Technical Details

### Theme Priority

1. User's manual selection (stored in localStorage)
2. System preference (`prefers-color-scheme`)
3. Default to light mode

### Browser Compatibility

- Modern browsers: Uses `addEventListener` for media query changes
- Legacy browsers: Falls back to `addListener`/`removeListener`
- Error handling for environments without localStorage

### Performance

- Inline script is minimal and runs synchronously
- No additional network requests
- React hook uses single effect with proper cleanup
- Media query listener only active when needed

## Testing

### Test Scenarios

1. **First Visit**: Should respect system preference
2. **Manual Toggle**: Should persist user choice
3. **Page Reload**: Should maintain selected theme
4. **System Change**: Should update if no manual preference
5. **localStorage Disabled**: Should fall back to system preference
6. **No Flash**: Theme should be correct on initial render

### Manual Testing

```javascript
// In browser console:

// Check current theme
localStorage.getItem("color-theme");

// Set dark theme
localStorage.setItem("color-theme", "dark");

// Set light theme
localStorage.setItem("color-theme", "light");

// Clear preference (use system)
localStorage.removeItem("color-theme");

// Check system preference
window.matchMedia("(prefers-color-scheme: dark)").matches;
```

## Migration Notes

### No Breaking Changes

- Existing components continue to work
- Same localStorage key (`color-theme`)
- Same class name (`dark` on `<html>`)
- Same UI/UX for end users

### Benefits

- No flash of incorrect theme
- Better system preference handling
- Cleaner, more maintainable code
- Reusable theme hook for future components
- Better error handling

## Future Enhancements

Possible improvements (not implemented):

- Add more theme options (e.g., auto, light, dark, custom)
- Theme transition animations
- Per-page theme overrides
- Theme context provider for global state
- Cookie-based storage for SSR consistency
