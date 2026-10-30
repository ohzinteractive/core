# AssetLoading

Downloads assets, decodes them with the matching three.js loader, and stores the result in `ResourceContainer`. Each asset gets its own loader, built on `AbstractLoader`. There are two ways to run them. Use a `ResourceBatch` to load a group of assets on the main thread, for example in the app preloader. Scenes use the async loaders instead: `AbstractScene` creates them for you, and they download every asset of a scene in a shared web worker. Write your own async loader when a scene needs an asset type the built-in ones don't cover.

## Export

```ts
import { AbstractLoader } from './resource_loader/AbstractLoader';
import { ResourceBatch } from './resource_loader/ResourceBatch';
import { GLTFLoader } from './resource_loader/GLTFLoader';  // and the other 16 loaders in resource_loader/
import { AsyncAbstractLoader } from './loaders/AsyncAbstractLoader';
import { AsyncTexturesLoader } from './loaders/AsyncTexturesLoader';
import { AsyncObjectsLoader } from './loaders/AsyncObjectsLoader';
import { AsyncAudiosLoader } from './loaders/AsyncAudiosLoader';
```

Not singletons. Instantiate them as needed.

## Loading Paths

```
ResourceBatch (main thread)              Async loaders (AbstractScene)
──────────────────────────               ───────────────────────────────────────────
batch.load()                             LoadingState.setup_loader()
  └─ loader.load(ResourceContainer)        └─ new Async*Loader(scene.name, assets, worker)
       ├─ url already stored?                   └─ posts 'assets' to the worker
       │    └─ reuse it, finish            loaders[0].load()  ← one call loads them all
       └─ fetch url, count bytes             └─ worker fetches every url into a blob URL
            └─ on_preloaded_finished(          └─ posts asset_loaded_<scene_name>
                 container, response)      each Async*Loader
                 └─ decode and store         ├─ swaps each loader's url for its blob URL
                                             └─ on_preloaded_finished(ResourceContainer)
                                                  └─ decode and store
poll batch.loading_finished              poll is_loaded()
```

---

## AbstractLoader

The base class of every loader. It loads one asset and tracks its progress. The caller polls `has_finished` and `has_error`, because `load()` returns nothing.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `resource_id` | Name the asset is stored under in `ResourceContainer`. |
| `url` | Where to fetch the asset from. |
| `size` | Estimated size in bytes. Defaults to `1`. Used as `total_bytes` until the download reports its real size, so it weights progress. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `resource_id` | `string` | Name of the stored resource. |
| `url` | `string` | Asset URL. The async loaders replace it with a blob URL. |
| `loaded_bytes` | `number` | Bytes downloaded so far. |
| `total_bytes` | `number` | Expected bytes. |
| `has_finished` | `boolean` | `true` once loading has ended, with or without an error. |
| `has_error` | `boolean` | `true` if loading failed. |
| `error_message` | `string` | The failure message. `'none'` until an error is set. |

### Methods

#### Loading

| Method | Description |
|--------|-------------|
| `load(resource_container)` | If `resource_container` already holds a resource for `url`, stores it under `resource_id` and finishes at once. Otherwise fetches `url` and passes the response to `on_progress()`. |
| `on_progress(resource_container, response)` | Async. Reads the response body and updates the byte counts. Then calls `on_preloaded_finished()` with a clone of the response, or sets an error and finishes for a non OK status. |
| `on_preloaded_finished(resource_container, response?)` | Empty in the base class. Subclasses decode the asset here, store it with `resource_container.set_resource()`, then call `__update_downloaded_bytes(1, 1)` and `__loading_ended()`. The async loaders call it without a `response`. |

#### Subclass Helpers

| Method | Description |
|--------|-------------|
| `__update_downloaded_bytes(loaded, total)` | Sets `loaded_bytes`, and `total_bytes` when `total > 0`. A value that isn't a number counts as `1`. Warns when more bytes are loaded than expected. |
| `__loading_ended()` | Sets `has_finished = true`. |
| `__set_error(message)` | Sets `has_error` and `error_message`. It doesn't finish the loader, so call `__loading_ended()` as well. |

#### Errors

| Method | Returns | Description |
|--------|---------|-------------|
| `print_error()` | `void` | Logs `resource_id`, `url` and `error_message`. |
| `is_int(n)` / `is_float(n)` / `is_number(n)` | `boolean` | Number checks used by `__update_downloaded_bytes()`. |

If `fetch` rejects (a network error, or a CORS failure), the error is only logged. The loader never finishes, so whatever polls it waits forever.

---

## ResourceBatch

Runs a group of loaders on the main thread and adds up their state.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `batch_name` | Name used in error output. Defaults to `'unnamed batch'`. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `resource_loaders` | `AbstractLoader[]` | The loaders added to the batch. |
| `batch_name` | `string` | Batch name. |

### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `loading_finished` | `boolean` | `true` when every loader has finished. |
| `has_errors` | `boolean` | `true` when any loader has an error. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `add_loader(loader)` | `void` | Adds a loader. |
| `load(resource_container?)` | `void` | Calls `load()` on every loader. The container defaults to the `ResourceContainer` singleton. |
| `print_errors()` | `void` | Logs the batch name, then `print_error()` for each failed loader. |
| `get_progress()` | `number` | Loaded bytes over total bytes, 0–1. |
| `get_loaded_bytes()` / `get_total_bytes()` | `number` | Sums over all loaders, each starting at 1 so an empty batch reads as complete. |

---

## Resource Loaders

All 17 extend `AbstractLoader` and take `resource_id` and `url` first. Each one stores the decoded asset in `on_preloaded_finished()`. Most wrap a three.js loader in a `loader` property and fetch the URL again through it, so the second request usually comes from the browser cache.

| Loader | Constructor | Stores |
|--------|-------------|--------|
| `GLTFLoader` | `(resource_id, url, size)` | The three.js GLTF result (`.gltf`, `.glb`). |
| `GLTFDRACOLoader` | `(resource_id, url, draco_loader, size)` | The GLTF result, decoded with the given `DRACOLoader`. |
| `OBJLoader` | `(resource_id, url, size)` | A `Group` from an `.obj` file. |
| `DAELoader` | `(resource_id, url, size)` | The Collada result (`.dae`). |
| `TextureLoader` | `(resource_id, url, size)` | A `Texture` built from an `HTMLImageElement`. |
| `AsyncTextureLoader` | `(resource_id, url, size, flipY = true, premultiplyAlpha = false, colorSpaceConversion = true)` | A `Texture` from an `ImageBitmap`, or from an `HTMLImageElement` on Safari. The flags set the texture's `flipY`, `premultiplyAlpha` and color space (sRGB, or none). |
| `BasisLoader` | `(resource_id, url, loader, size)` | Whatever the given `loader` returns. The boilerplate passes a `KTX2Loader`. |
| `HDRTextureLoader` | `(resource_id, url, size)` | A `DataTexture` from an `.hdr` file. |
| `CubemapLoader` | `(resource_id, url, extension, size)` | A `CubeTexture` from `url/px.<extension>` … `url/nz.<extension>`. |
| `HDRCubeTextureLoader` | `(resource_id, url, extension, size)` | An HDR `CubeTexture` from the same six file names. |
| `AudioLoader` | `(resource_id, url, loop = true, volume = 0, size, positional = false)` | An `AudioClip` decoded with the shared Web Audio context. |
| `VideoLoader` | `(resource_id, url, size)` | An object URL (`string`) for the video blob, not a texture. |
| `FontLoader` | `(resource_id, url, size)` | A `Font` from a three.js typeface JSON file. |
| `JSONLoader` | `(resource_id, url, size)` | The parsed JSON. |
| `FileLoader` | `(resource_id, url, size)` | The file contents as a `string`. |
| `TextLoader` | `(resource_id, url, size)` | The file contents as a `string`. Same as `FileLoader`. |
| `PointArrayLoader` | `(resource_id, url, size)` | A `Vector3[]` from `parse_path()`. |

Extra members users may need:

| Member | Description |
|--------|-------------|
| `PointArrayLoader.parse_path(raw_data)` | Splits the text by line and reads every three lines as `x`, `y` and `z`. Returns `Vector3[]`. |
| `AsyncTextureLoader.load_with_old_method(container)` / `load_with_new_method(container)` | The `Image` and `createImageBitmap` paths. `on_preloaded_finished()` picks one through `Browser.is_safari`. |
| `CubemapLoader.urls` / `HDRCubeTextureLoader.urls` | The six face file names. |

`TextureLoader` and `VideoLoader` read the `response` argument, so they work only through `load()` (a `ResourceBatch`), not through the async loaders. When `AsyncTextureLoader` fails to decode, it only logs the error and never finishes.

---

## Async Loaders

`AsyncAbstractLoader` loads a list of asset descriptors through the shared assets worker. The worker only downloads: it turns each URL into a blob URL. Decoding happens on the main thread, in the resource loaders that the subclass creates in `__setup_loaders()`. `LoadingState` (see [AbstractScene](AbstractScene.md)) builds the three built-in loaders for each scene, with the worker stored as `ResourceContainer.get('assets_worker')`.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `name` | Loader group name. `LoadingState` passes the scene name, so all loaders of a scene share one worker batch. |
| `assets` | Array of asset descriptors, sent to the worker right away. |
| `worker` | The assets worker, from `AsyncAbstractLoader.create_worker()`. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Loader group name. |
| `assets` | `any[]` | The asset descriptors. |
| `assets_loaders` | `any[]` | The resource loaders returned by `__setup_loaders()`. |
| `resource_container` | `ResourceContainer` | Where decoded assets are stored. Always the singleton. |
| `worker` | `Worker` | The assets worker. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `static create_worker()` | `Worker` | Creates the module worker that downloads assets. Create one per app and store it as `'assets_worker'`. |
| `load()` | `void` | Asks the worker to load everything sent under `name`. Loaders that share a `name` load together, so one call is enough. |
| `is_loaded()` | `boolean` | `true` when every resource loader has finished. Prints the errors of failed loaders on every call. |
| `get_progress()` | `number` | Loaded bytes over total bytes, 0–1. |
| `get_assets_names()` | `string[]` | The `name` of every descriptor. Passed to the compilators. |
| `__setup_loaders()` | `any[]` | Subclass hook. Returns one resource loader per descriptor. The base version warns and returns `[]`. |

The worker doesn't report download progress, so `get_progress()` stays near 0 until the downloads finish, then rises as each asset decodes. If any download fails, the worker prints the errors and never replies. `is_loaded()` then never returns `true`.

### Built-in Async Loaders

All three take `(scene_name, assets, worker)`. Every descriptor has `name`, `url` and an optional `size`.

| Class | Extra descriptor fields | Creates |
|-------|-------------------------|---------|
| `AsyncObjectsLoader` | `draco` | `GLTFDRACOLoader` with `ResourceContainer.get('draco_loader')` when `draco` is true, otherwise `GLTFLoader`. |
| `AsyncTexturesLoader` | `kind`, plus `flipY`, `premultiplyAlpha`, `colorSpaceConversion` (regular) or `extension` (cubemaps) | By `kind`: `'regular'` → `AsyncTextureLoader`, `'basis'` → `BasisLoader` with `ResourceContainer.get('basis_loader')`, `'hdr'` → `HDRTextureLoader`, `'cubemap'` → `CubemapLoader`, `'cubemap_hdr'` → `HDRCubeTextureLoader`. Any other `kind`, or none, is skipped without a warning. |
| `AsyncAudiosLoader` | `loop`, `volume`, `positional` | `AudioLoader`. `volume` defaults to `0`, so set it. |

## Usage

```ts
// Preloader: create the shared worker and load app wide assets on the main thread
ResourceContainer.set_resource('assets_worker', '/assets_worker', AsyncAbstractLoader.create_worker());

const batch = new ResourceBatch('general_loader');
batch.add_loader(new JSONLoader('config', '/data/config.json', 2000));
batch.add_loader(new FontLoader('title_font', '/fonts/title.json', 48000));
batch.load();

// Poll each frame
if (batch.loading_finished)
{
  if (batch.has_errors) batch.print_errors();
  else start_app(ResourceContainer.get('config'));
}

// A custom async loader for AbstractScene.set_assets(objects, textures, sounds, [AsyncJSONLoader], [JSONCompilator], [scene_json])
class AsyncJSONLoader extends AsyncAbstractLoader
{
  __setup_loaders()
  {
    return this.assets.map(asset => new JSONLoader(asset.name, asset.url, asset.size));
  }
}
```
