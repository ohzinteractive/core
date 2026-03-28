# ResourceContainer

A singleton registry that stores loaded assets (textures, models, audio, etc.) by name, with built-in URL deduplication so the same file loaded under different names shares a single resource instance.

## Singleton Export

```ts
import { ResourceContainer } from './ResourceContainer';
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `resources` | `Record<string, any>` | Map of name → resource. |
| `resources_by_url` | `Record<string, any>` | Map of URL → resource. Used for deduplication. |

## Methods

### `init()`

Resets both maps to empty objects. Called once during application startup.

### `set_resource(name: string, url: string, resource: any)`

Registers a resource under the given `name`.

- If a resource with the same `url` has already been stored, the existing instance is reused — the new `name` becomes an alias pointing to the same object, and the provided `resource` argument is discarded.
- Otherwise, the `resource` is stored under both the `name` and the `url`.

This ensures that assets loaded from the same URL are never duplicated in memory, regardless of how many names reference them.

### `get_resource(name: string): any`

Returns the resource registered under `name`, or `undefined` if not found.

### `get(name: string): any`

Shorthand alias for `get_resource`.

## Usage

```ts
// During asset loading
ResourceContainer.set_resource('hero_texture', '/assets/hero.png', loadedTexture);

// Later, in application code
const tex = ResourceContainer.get('hero_texture');
```

If another asset is loaded from the same URL under a different name, both names resolve to the same object:

```ts
ResourceContainer.set_resource('hero_diffuse', '/assets/hero.png', anotherTexture);
// ResourceContainer.get('hero_diffuse') === ResourceContainer.get('hero_texture')
```
