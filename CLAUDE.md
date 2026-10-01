# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OHZI Core is a TypeScript WebGL/WebGPU graphics library built on top of [Three.js](https://github.com/mrdoob/three.js). It is not standalone — it is designed to be used within the [OHZI Boilerplate](https://github.com/ohzinteractive/boilerplate) project.

## Commands

```bash
yarn start          # Development watch mode (rollup -w -c)
yarn build          # Production build
yarn generate-types # Generate TypeScript declaration files
yarn fix-syntax     # Lint and auto-fix with ESLint
yarn upload         # Build, publish to npm, and create git tag
```

Code generation helpers:
```bash
yarn create-view
yarn create-scene
yarn create-component
yarn create-transition
```

Tests (Vitest, two projects):
```bash
yarn test           # Everything
yarn test-unit      # Node tests: tests/**/*.test.ts
yarn test-browser   # Real GPU tests in headless Chromium: tests/**/*.browser.test.ts
```

Browser tests need Chromium once: `npx playwright install chromium`. Render mode tests run against `WebGPURenderer` twice, with the WebGPU backend and with `forceWebGL: true`, and assert the backend so a silent WebGL fallback cannot pass as WebGPU.

## Architecture

### Core Lifecycle

The frame loop is driven by **`RenderLoop`**, which calls lifecycle hooks in order each frame: `on_enter()` → `before_update()` → `update()` → `fixed_update()` → `on_pre_render()` → `on_post_render()` → `on_frame_end()` → `on_exit()`. Users extend **`BaseApplication`** to implement these hooks.

**`Graphics`** wraps the Three.js renderer and is the central rendering system. It manages render modes, material passes, render targets, blitting, and screenshot capture. Render modes (e.g. Unreal Bloom, Normal AO, VR) live in `src/render_mode/` and extend `BaseRender`.

**`Time`** provides `delta_time`, `elapsed_time`, `smooth_delta_time`, and a fixed timestep (`fixed_delta_time = 1/30`). **`OScreen`** tracks viewport dimensions and DPR.

### Scene & Camera

**`SceneManager`** manages Three.js Scene instances and handles disposal. **`AbstractScene`** (in `src/scenes/`) extends Three.js Scene with progressive loading states (regular and high-quality). **`CameraManager`** provides global access to the active camera and an optional VR spectator camera.

### Materials & Shaders

`src/materials/` contains ~30 custom `THREE.ShaderMaterial` subclasses, most extending **`BaseShaderMaterial`** or **`BlitMaterial`**. These GLSL materials only work on the legacy `WebGLRenderer`: `WebGPURenderer` rejects `ShaderMaterial` on both of its backends. Materials ported to TSL extend **`BlitNodeMaterial`** (a `NodeMaterial`) and keep the `uniforms.<name>.value` contract, so `Blitter` drives both kinds the same way. So far that covers `BlitNodeMaterial` (Blitter's default copy), `BoxBlurMaterial` and `BloomComposeMaterial`, which makes `BloomRender` WebGPU ready, plus `LuminosityHighPassMaterial`, `GaussianBlurMaterial`, `UnrealBloomComposeMaterial` and `AddMaterial`, which make `GaussianBlurrer` and `UnrealBloomRender` WebGPU ready. `NormalMaterial` is an unlit `NodeMaterial` (not a blit) used as a scene override, which makes `DebugNormalsRender` WebGPU ready; it tags its packed normals as sRGB with `colorSpaceToWorking` so the output conversion leaves them raw, like three's `MeshNormalNodeMaterial`. `DepthNormalMaterial` and `ClearDepthNormalMaterial` fill the `DepthAndNormalsRenderer` target (depth over the far plane in RG, a stereographic view space normal in BA, packed by `materials/deferred/depth_normal_encoding.ts`), and `DeferredPointLightMaterial` is a light volume `NodeMaterial` that reads it at `screenUV`, which makes `DeferredRender` WebGPU ready. Node materials work in linear color on every target and the renderer applies the sRGB output conversion, so the old `USE_LINEAR_COLOR_SPACE` flags no longer change the shaders. MSAA render targets must use 1 or 4 samples: WebGPU rejects other counts and the target silently renders nothing.

### Asset Loading

`src/resource_loader/` has individual loaders (GLTF, textures, HDR, audio, fonts, etc.) based on `AbstractLoader`. `src/loaders/` wraps these in async batch loaders (`AsyncTexturesLoader`, `AsyncObjectsLoader`, etc.). **`ResourceContainer`** caches assets by URL to prevent duplicate loads.

### Build System

Rollup (`rollup.config.mjs`) bundles TypeScript to a single ES module (`build/index.mjs`) with sourcemaps and terser minification. TypeScript declarations are generated separately via `yarn generate-types` into `types/`. The package entry points are `build/index.mjs` (module) and `types/index.d.ts` (types).

### Key Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/materials/` | Shader materials, deferred rendering, GPU particles materials |
| `src/resource_loader/` | Individual asset loaders |
| `src/loaders/` | Async batch loaders |
| `src/components/` | Renderable components (Grid, Text2D, WorldImage, SDF text) |
| `src/render_mode/` | Rendering strategies (Bloom, NormalAO, VR, Debug) |
| `src/render_utilities/` | Post-processing (blurring, depth/normals, blit) |
| `src/scenes/` | AbstractScene and loading state management |
| `src/view_components/` | UI layer abstraction with ViewManager and transitions |
| `src/raycast/` | Ray intersection utilities |
| `src/utilities/` | Math, easing, geometry, camera, image helpers |
| `src/gpu_particles/` | GPU-accelerated particle system |
| `src/action_sequencer/` | Event sequencing with interpolators |
| `src/shaders/` | GLSL shader files, organized by feature |
| `docs/` | Markdown documentation for core classes |
