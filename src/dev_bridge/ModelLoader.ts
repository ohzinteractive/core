import type { BufferGeometry, Material, Object3D } from 'three';
import { Box3 } from 'three';

const PRECISION = 10000;

export type GltfLike = { scene: Object3D };
export type LoadGltf = (url: string, draco: boolean) => Promise<GltfLike>;

export interface ResourceStore
{
  replace_resource(name: string, url: string, resource: unknown): void;
}

export interface ModelSummary
{
  name: string;
  meshes: number;
  triangles: number;
  bounding_box: { min: number[]; max: number[] } | null;
}

type Drawable = Object3D & { isMesh?: boolean; geometry?: BufferGeometry; material?: Material | Material[] };

/**
 * Loads a GLB into the running scene for the import_model preview. A model of
 * the same name is swapped out, so importing a re-exported file again replaces
 * it in place.
 */
class ModelLoader
{
  private load_gltf: LoadGltf;
  private resources: ResourceStore;

  constructor(load_gltf: LoadGltf, resources: ResourceStore)
  {
    this.load_gltf = load_gltf;
    this.resources = resources;
  }

  async load(scene: Object3D, args: Record<string, unknown>): Promise<ModelSummary>
  {
    const name = args.name;
    const url = args.url;

    if (typeof name !== 'string' || name.length === 0)
    {
      throw this.error('bad_request', 'load_object needs a name.');
    }

    if (typeof url !== 'string' || url.length === 0)
    {
      throw this.error('bad_request', 'load_object needs a url.');
    }

    if (scene === undefined || scene === null)
    {
      throw this.error('not_found', 'There is no current scene to add the model to.');
    }

    // The version is a hash of the file. The same url serves new bytes after a
    // replace, and without it the browser would answer from its cache.
    const version = typeof args.version === 'string' && args.version.length > 0 ? args.version : null;
    const fetch_url = version === null ? url : `${url}?v=${encodeURIComponent(version)}`;

    let gltf: GltfLike;

    try
    {
      gltf = await this.load_gltf(fetch_url, args.draco === true);
    }
    catch (error)
    {
      throw this.error('load_failed', `Could not load ${url}: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (gltf === null || typeof gltf !== 'object' || gltf.scene === undefined || gltf.scene === null)
    {
      throw this.error('load_failed', `${url} loaded, but it has no scene.`);
    }

    this.resources.replace_resource(name, url, gltf);

    const previous = scene.children.find((child) => child.name === name);

    if (previous !== undefined)
    {
      scene.remove(previous);
      this.dispose(previous);
    }

    gltf.scene.name = name;
    scene.add(gltf.scene);

    return this.summarize(name, gltf.scene);
  }

  private summarize(name: string, root: Object3D): ModelSummary
  {
    let meshes = 0;
    let triangles = 0;

    root.traverse((node) =>
    {
      const drawable = node as Drawable;

      if (drawable.isMesh !== true || drawable.geometry === undefined)
      {
        return;
      }

      const geometry = drawable.geometry;
      const count = geometry.index !== null ? geometry.index.count : (geometry.attributes.position?.count ?? 0);

      meshes++;
      triangles += Math.floor(count / 3);
    });

    root.updateMatrixWorld(true);

    const box = new Box3().setFromObject(root);
    const round = (value: number) => Math.round(value * PRECISION) / PRECISION;

    return {
      name,
      meshes,
      triangles,
      bounding_box: box.isEmpty() ? null : { min: box.min.toArray().map(round), max: box.max.toArray().map(round) }
    };
  }

  private dispose(root: Object3D)
  {
    root.traverse((node) =>
    {
      const drawable = node as Drawable;

      drawable.geometry?.dispose();

      const materials = Array.isArray(drawable.material)
        ? drawable.material
        : drawable.material === undefined ? [] : [drawable.material];

      for (const material of materials)
      {
        material.dispose();
      }
    });
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { ModelLoader };
