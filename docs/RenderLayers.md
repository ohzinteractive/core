# RenderLayers

A static enum-like class that defines named layer indices for Three.js `Object3D.layers`. Used to categorize objects for selective rendering passes.

## Export

```ts
import { RenderLayers } from './RenderLayers';
```

## Layers

| Getter | Value | Description |
|--------|-------|-------------|
| `RenderLayers.opaque` | `0` | Default layer for opaque geometry. |
| `RenderLayers.transparent` | `1` | Layer for transparent geometry. |
| `RenderLayers.outline` | `2` | Layer for objects that receive an outline effect. |
| `RenderLayers.selectable` | `3` | Layer for objects that can be selected (e.g., via raycasting). |

## Usage

```ts
// Assign an object to the transparent layer
mesh.layers.set(RenderLayers.transparent);

// Enable a camera to see both opaque and transparent layers
camera.layers.enable(RenderLayers.opaque);
camera.layers.enable(RenderLayers.transparent);
```
