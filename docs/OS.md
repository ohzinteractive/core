# OS

A singleton that detects the user's operating system and device type at initialization time using `navigator.userAgent` and `navigator.platform`. Provides boolean flags for quick platform checks.

## Singleton Export

```ts
import { OS } from './OS';
```

## Properties

All flags are set once during `init()` and remain constant for the lifetime of the application.

| Property | Type | Description |
|----------|------|-------------|
| `is_mobile` | `boolean` | `true` on phones, tablets, and other mobile devices (matches iPhone, iPad, Android, BlackBerry, Windows Phone, etc.). |
| `is_ios` | `boolean` | `true` on iPhone, iPod, iPad, or modern iPads detected via `maxTouchPoints`. |
| `is_ipad` | `boolean` | `true` specifically for iPads, including modern iPads that report as "Mac" in their user agent but expose `maxTouchPoints > 2`. |
| `is_android` | `boolean` | `true` on Android devices. |
| `is_mac` | `boolean` | `true` on macOS (Macintosh, MacIntel, MacPPC, Mac68K platforms). |
| `is_windows` | `boolean` | `true` on Windows (Win32, Win64, WinCE platforms). |
| `is_linux` | `boolean` | `true` on Linux (when platform contains "Linux" and no other OS matched). |

### `operating_systems`

An enum-like object with string constants used internally for OS identification:

```ts
{ ANDROID: 'android', IOS: 'ios', LINUX: 'linux', MAC: 'mac', WINDOWS: 'windows' }
```

## Methods

### `init()`

Reads `navigator.userAgent` and `navigator.platform` to populate all boolean flags. Called once during application startup.

### `get_os(): string`

Returns the detected OS as one of the `operating_systems` string constants, or `null` if none matched. Detection priority:

1. **macOS** — platform in `['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']`
2. **iOS** — platform in `['iPhone', 'iPad', 'iPod']`
3. **Windows** — platform in `['Win32', 'Win64', 'Windows', 'WinCE']`
4. **Android** — user agent contains `"Android"`
5. **Linux** — platform contains `"Linux"` (fallback)

## Notes

- `is_mobile` and `is_ipad` use independent user-agent checks and are not derived from `get_os()`.
- Modern iPads (iPadOS 13+) disguise themselves as Mac in the user agent; `is_ipad` handles this by additionally checking `maxTouchPoints > 2`.
- `is_mobile` can be `true` simultaneously with `is_ios` or `is_android`.
