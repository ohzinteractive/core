# OHZI Core

OHZI Core is a library that collects a bunch of standalone classes to help build high-quality [WebGL](https://www.khronos.org/webgl/) and [WebGPU](https://webgpu.org/) experiences fast.

This library is a complement of [three.js](https://github.com/mrdoob/three.js) and [PIT](https://github.com/ohzinteractive/PIT).

> **Note:** OHZI Core is not meant to be used on its own. It is part of the [OHZI Boilerplate](https://github.com/ohzinteractive/boilerplate) project, which provides the full setup and scaffolding needed to get started quickly.

## Key Classes

- **`Graphics`** — Central rendering system that wraps the Three.js renderer. Manages render modes, material passes, blitting, and screenshot capture.
- **`RenderLoop`** — Drives the main frame loop, coordinating time updates, input handling, scene transitions, and application lifecycle calls.
- **`Time`** — Provides frame timing utilities including `delta_time`, `elapsed_time`, and `smooth_delta_time` for consistent frame-rate-independent logic.
- **`OScreen`** — Manages viewport dimensions, pixel density (DPR), and aspect ratio so cameras and UI scale correctly across devices.
- **`ResourceContainer`** — A simple asset cache that stores loaded resources and prevents duplicate loading by tracking URLs.
- **`BaseApplication`** — Abstract base class that defines the application lifecycle through hooks like `update()`, `fixed_update()`, `on_pre_render()`, and `on_post_render()`.
- **`SceneManager`** — Holds and switches between Three.js scenes, handling geometry and material cleanup on disposal.
- **`CameraManager`** — Provides global access to the current rendering camera and an optional VR spectator camera.

The library also includes a collection of ready-to-use materials, loaders, primitives, canvas drawing utilities, and more.

## Documentation

- [AbstractScene](docs/AbstractScene.md) — Three.js `Scene` with two-phase asset loading, render hooks, and disposal.
- [ActionSequencer](docs/ActionSequencer.md) — Timeline that eases context keys and fires events, its interpolators, and the builders that make one from transition data or draw.io.
- [AssetLoading](docs/AssetLoading.md) — `AbstractLoader`, the 17 resource loaders, `ResourceBatch`, and the worker based async loaders.
- [CameraController](docs/CameraController.md) — Orbital camera rig: tilt and orientation, framing, pluggable movement modes and input states.
- [CameraManager](docs/CameraManager.md) — Holds the active cameras used by the rendering pipeline.
- [Debug](docs/Debug.md) — Debug drawing layer for the 3D scene and a 2D canvas overlay.
- [Graphics](docs/Graphics.md) — Renderer wrapper: render modes, blitting, depth/normals, resize, and screenshots.
- [Initializer](docs/Initializer.md) — Bootstraps the core singletons at startup and tears them down.
- [KeyboardInput](docs/KeyboardInput.md) — Per-key pressed, down, and released state.
- [OrthographicCamera](docs/OrthographicCamera.md) — Three.js `OrthographicCamera` with per-camera clear color and alpha.
- [OS](docs/OS.md) — Operating system and device type detection.
- [OScreen](docs/OScreen.md) — Canvas size, position, DPR, and coordinate conversions.
- [PerspectiveCamera](docs/PerspectiveCamera.md) — Three.js `PerspectiveCamera` with per-camera clear color and alpha.
- [PostProcessing](docs/PostProcessing.md) — Full screen passes: `BlitNodeMaterial`, the box, dual filtering and Gaussian blurrers, and the bloom compose materials.
- [RenderLayers](docs/RenderLayers.md) — Named layer indices for selective rendering passes.
- [RenderLoop](docs/RenderLoop.md) — The main frame loop and its lifecycle.
- [RenderModes](docs/RenderModes.md) — `BaseRender` and the built-in render modes: normal, bloom, SSAO, deferred, VR, and debug normals.
- [ResourceContainer](docs/ResourceContainer.md) — Asset registry with URL deduplication.
- [SceneManager](docs/SceneManager.md) — The active scene and scene disposal.
- [Time](docs/Time.md) — Delta, elapsed, smoothed, and fixed-step timing.
- [Views](docs/Views.md) — `ApplicationView`, `ViewManager`, `ViewComponent`, and the state data transitions between views.


## License

MIT
