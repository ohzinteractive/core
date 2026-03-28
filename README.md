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

The library also includes a collection of ready-to-use materials, loaders, primitives, canvas drawing utilities, GPU particle helpers, and more.

## License

MIT
