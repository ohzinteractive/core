# Browser

A singleton that detects the browser, its major version, video format support and WebXR VR support from `navigator.userAgent` and `navigator.xr`. Use it for browser-specific workarounds and to pick a video file the browser can play. `Capabilities`, a second startup singleton meant to hold GPU limits, is documented at the end; nothing fills it yet.

## Singleton Export

```ts
import { Browser } from './Browser';
```

`Initializer.init()` calls `Browser.init()` once at startup without awaiting it (see [Initialization](#initialization)).

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `agent` | `string` | `navigator.userAgent`, lowercased. |
| `browser_name` | `string` | One of `'edge_ie'`, `'edge_chromium'`, `'opera'`, `'chrome'`, `'iexplorer'`, `'firefox'`, `'safari'` or `'other'`. Empty (`''`) until detection runs. |
| `version` | `number` | Major version from `get_version()`. Can be fractional on Safari (see [Version](#version)). |
| `has_web_xr_support` | `boolean` | `true` when `navigator.xr` exists (secure contexts only). |
| `is_vr` | `boolean` | `true` when WebXR supports `immersive-vr` sessions. |

## Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Alias for `browser_name`. |
| `is_chrome` | `boolean` | `browser_name === 'chrome'`. |
| `is_firefox` | `boolean` | `browser_name === 'firefox'`. |
| `is_safari` | `boolean` | `browser_name === 'safari'`. Also `true` for every iOS browser (see Notes). |
| `is_edge` | `boolean` | Legacy EdgeHTML Edge (`'edge_ie'`). |
| `is_edge_chromium` | `boolean` | Chromium-based Edge (`'edge_chromium'`). |
| `has_webm` | `boolean` | `true` on Chrome, Firefox and Chromium Edge. |
| `has_hvec` | `boolean` | `true` on Safari. HEVC support, spelled `hvec` in the API. |
| `preferred_video_extension` | `string` | `'webm'` when `has_webm`, else `'hvec.mp4'` when `has_hvec`, else `'mp4'`. |

There are no `is_opera` or `is_ie` getters; compare `name` with `'opera'` or `'iexplorer'`.

## Methods

### Setup

| Method | Returns | Description |
|--------|---------|-------------|
| `init()` | `Promise<void>` | Reads the user agent, checks WebXR, then sets `browser_name` and `version`. Async because of the WebXR check. |

### Querying

| Method | Returns | Description |
|--------|---------|-------------|
| `get_version()` | `number` | Parses the major version from `navigator.userAgent`. `init()` stores the result in `version`. |

## Detection Order

`init()` takes the first match, testing the lowercased user agent:

| Order | Condition | `browser_name` |
|-------|-----------|----------------|
| 1 | contains `edge` | `edge_ie` |
| 2 | contains `edg` | `edge_chromium` |
| 3 | contains `opr` and `window.opr` exists | `opera` |
| 4 | contains `chrome` and `window.chrome` exists | `chrome` |
| 5 | contains `trident` | `iexplorer` |
| 6 | contains `firefox` | `firefox` |
| 7 | contains `safari` | `safari` |
| 8 | anything else | `other` |

## Version

`get_version()` takes the number after the first `Opera`, `Chrome`, `Safari`, `Firefox`, `MSIE` or `Trident` token. If the user agent has a `Version/x.y` token, that wins, so Safari reports its real version (`Version/17.4` gives `17.4`, not `17`). In practice:

- Chromium Edge and Opera report their Chromium version, not their own.
- iOS browsers report the iOS Safari version.
- IE 11 reports `7` (the Trident version).
- A user agent with none of these tokens falls back to `navigator.appVersion`, which gives `5` in modern browsers.

## Initialization

`init()` is async, and `browser_name` and `version` are set **after** the WebXR check resolves. `Initializer.init()` does not await it, so they are not ready when `Initializer.init()` returns:

```
Browser.init()
  │
  ├─ browser_name = ''
  ├─ agent, has_web_xr_support          ← set synchronously
  ├─ await navigator.xr.isSessionSupported('immersive-vr')
  │     (await false when there is no WebXR: one microtask)
  │
  ├─ is_vr
  ├─ browser_name                       ← detection order above
  └─ version
```

Until then `name` is `''` and every `is_*` getter is `false`. By the time a scene or view runs, detection has finished. If `isSessionSupported()` rejects (for example, when a permissions policy blocks WebXR in an iframe), `init()` stops there: `browser_name` stays `''`, `version` stays `undefined`, and the rejection is unhandled.

## Usage

```ts
const video = document.createElement('video');
video.src = `videos/intro.${Browser.preferred_video_extension}`;

if (Browser.is_safari && Browser.version < 15)
{
  // Safari 14 workaround
}

if (Browser.is_vr)
{
  // Show the "Enter VR" button
}
```

## Notes

- Every iOS browser is WebKit and its user agent has `Safari` but not `Chrome` or `Firefox` (Chrome on iOS sends `CriOS`), so they all detect as `safari`.
- A Chromium user agent also contains `Safari`, so a Chromium browser without `window.chrome` (some WebViews) detects as `safari`.
- `has_webm` is `false` on Opera, even though Opera plays WebM.
- `preferred_video_extension` is a file naming convention: ship `name.webm`, `name.hvec.mp4` and `name.mp4` side by side.
- `AsyncTextureLoader` reads `Browser.is_safari` to load textures through `Image` instead of `createImageBitmap`.

---

## Capabilities

A singleton meant to hold GPU limits read from the renderer. Nothing fills it yet: `init()` only sets the defaults, and the lines in `Graphics.init()` that would copy the renderer's limits into it are commented out. Ask the renderer instead, for example `Graphics._renderer.getMaxAnisotropy()`.

### Singleton Export

```ts
import { Capabilities } from './Capabilities';
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `max_anisotropy` | `number` | Meant to be the renderer's maximum anisotropy. Always `0`. |
| `vertex_texture_sampler_available` | `boolean` | Meant to say whether vertex shaders can sample textures. Always `false`. |

### Methods

| Method | Description |
|--------|-------------|
| `init()` | Sets `max_anisotropy = 0` and `vertex_texture_sampler_available = false`. Called by `Initializer.init()`. |
