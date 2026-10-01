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

Some materials and components in `src/` are still GLSL `ShaderMaterial`s, most extending **`BaseShaderMaterial`** or **`BlitMaterial`**. They only work on the legacy `WebGLRenderer`: `WebGPURenderer` rejects `ShaderMaterial` on both of its backends. `tests/migration/glsl_inventory.test.ts` lists every GLSL file and GLSL backed module left, grouped by the migration session that removes it (roadmap: `docs/superpowers/plans/2026-10-01-glsl-to-tsl-roadmap.md`). A port deletes its entries first, so the test fails until the GLSL is gone. New GLSL fails it too. Materials ported to TSL extend **`BlitNodeMaterial`** (a `NodeMaterial`) and keep the `uniforms.<name>.value` contract, so `Blitter` drives both kinds the same way. So far that covers `BlitNodeMaterial` (Blitter's default copy), `BoxBlurMaterial` and `BloomComposeMaterial`, which makes `BloomRender` WebGPU ready, plus `LuminosityHighPassMaterial`, `GaussianBlurMaterial`, `UnrealBloomComposeMaterial` and `AddMaterial`, which make `GaussianBlurrer` and `UnrealBloomRender` WebGPU ready. `NormalMaterial` is an unlit `NodeMaterial` (not a blit) used as a scene override, which makes `DebugNormalsRender` WebGPU ready; it tags its packed normals as sRGB with `colorSpaceToWorking` so the output conversion leaves them raw, like three's `MeshNormalNodeMaterial`. `DepthNormalMaterial` and `ClearDepthNormalMaterial` fill the `DepthAndNormalsRenderer` target (depth over the far plane in RG, a stereographic view space normal in BA, packed by `materials/deferred/depth_normal_encoding.ts`), and `DeferredPointLightMaterial` is a light volume `NodeMaterial` that reads it at `screenUV`, which makes `DeferredRender` WebGPU ready. `SSAOMaterial` reads the same target to compute occlusion (a 64 sample `uniformArray` kernel in a TSL `Loop`), and since its samples land between texels it decodes the four nearest texels (`texture.load`) and interpolates the depths itself: the texture filter returns 8 bit channels with only a few extra bits, which the RG packing scales by 255 wherever the high byte steps, enough to self occlude flat surfaces in diagonal bands. Reads at texel centers, like `DeferredPointLightMaterial`'s, are exact and can keep the filter. That exact read is the default; `new NormalAORender(use_ssaa, false)` (`SSAOMaterial(false)`) goes back to one filtered fetch per sample, which measured about 2.2x faster for the SSAO pass (3.0 vs 6.6 ms at 1080p on WebGPU) but bands flat surfaces. Then `SSAOComposeMaterial` darkens the scene with the occlusion, which makes `NormalAORender` WebGPU ready. Blits that sample a texture at computed points, not just at the quad UV, map them with `BlitNodeMaterial.texture_uv_at`, which applies the same top left origin flip for render targets. Node materials work in linear color on every target and the renderer applies the sRGB output conversion, so the old `USE_LINEAR_COLOR_SPACE` flags no longer change the shaders. MSAA render targets must use 1 or 4 samples: WebGPU rejects other counts and the target silently renders nothing.

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
