import { WorldImage } from '../components/WorldImage';

import type { Material, Mesh, Object3D } from 'three';
import { Box3, Sphere, Vector3 } from 'three';

type Color = number | string;

interface DebugLike
{
  draw_cube(pos?: Vector3, size?: number, color?: Color): Object3D;
  draw_sphere(pos: Vector3, size: number, color?: Color): Object3D;
  draw_plane(width?: number, height?: number, color?: Color): Object3D;
  draw_math_sphere(sphere: Sphere, color?: Color): Object3D;
  draw_bounding_box(bb: Box3, color?: Color): Object3D;
  draw_label(text: string, pos?: Vector3, size?: number, color?: Color): Object3D;
}

interface DebugDrawRequest
{
  shape?: unknown;
  position?: unknown;
  size?: unknown;
  color?: unknown;
  object?: unknown;
  text?: unknown;
}

interface DebugDrawResult
{
  id: string;
  shape: string;
  helpers: number;
}

interface DebugClearRequest
{
  id?: unknown;
}

interface DebugClearResult
{
  removed: number;
  helpers: number;
}

const SHAPES = ['cube', 'sphere', 'plane', 'math_sphere', 'bounding_box', 'label'];

// Only helpers drawn through this class are tracked, so debug_clear never touches the
// helpers the app draws for itself into Debug.scene.
class DebugDrawer
{
  private helpers = new Map<string, Object3D>();

  draw(debug: DebugLike, root: Object3D, request: DebugDrawRequest): DebugDrawResult
  {
    const shape = typeof request.shape === 'string' && SHAPES.includes(request.shape) ? request.shape : null;

    if (shape === null)
    {
      throw this.error('bad_request', `Unknown shape. Valid shapes: ${SHAPES.join(', ')}.`);
    }

    const position = this.position(request.position);
    const size = this.size(request.size);
    const color = this.color(request.color);
    const helper = this.build(debug, root, shape, request, position, size, color);

    this.helpers.set(helper.uuid, helper);

    return { id: helper.uuid, shape, helpers: this.helpers.size };
  }

  private build(debug: DebugLike, root: Object3D, shape: string, request: DebugDrawRequest, position: Vector3, size: number, color: Color | undefined): Object3D
  {
    switch (shape)
    {
      case 'cube':
        return debug.draw_cube(position, size, color);

      case 'sphere':
        // Sphere's size is its radius, which is what the contract promises.
        return debug.draw_sphere(position, size, color);

      case 'plane':
      {
        const plane = debug.draw_plane(size, size, color);
        plane.position.copy(position);

        return plane;
      }

      case 'math_sphere':
        return debug.draw_math_sphere(new Sphere(position, size), color);

      case 'label':
        // Size is the text height.
        return debug.draw_label(this.text(request.text), position, size, color);

      default:
        return debug.draw_bounding_box(this.bounds(root, request.object), color);
    }
  }

  clear(request: DebugClearRequest): DebugClearResult
  {
    if (request.id === undefined)
    {
      const removed = this.helpers.size;

      this.helpers.forEach((helper) => this.dispose(helper));
      this.helpers.clear();

      return { removed, helpers: 0 };
    }

    const helper = typeof request.id === 'string' ? this.helpers.get(request.id) : undefined;

    if (helper === undefined)
    {
      throw this.error('not_found', 'No helper with that id was drawn through debug_draw.');
    }

    this.dispose(helper);
    this.helpers.delete(helper.uuid);

    return { removed: 1, helpers: this.helpers.size };
  }

  private dispose(helper: Object3D): void
  {
    helper.removeFromParent();

    helper.traverse((node) =>
    {
      const mesh = node as Partial<Mesh>;

      mesh.geometry?.dispose();

      const materials: Material[] = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      materials.forEach((material) => material.dispose());

      // A label owns its canvas texture.
      if (node instanceof WorldImage)
      {
        node.material.uniforms._MainTex.value.dispose();
      }
    });
  }

  private bounds(root: Object3D, target: unknown): Box3
  {
    const { name, uuid } = (typeof target === 'object' && target !== null ? target : {}) as { name?: unknown, uuid?: unknown };

    if (typeof uuid !== 'string' && typeof name !== 'string')
    {
      throw this.error('bad_request', 'bounding_box needs an object with a name or a uuid.');
    }

    // uuid wins over name, like SceneEditor.
    const found = typeof uuid === 'string'
      ? root.getObjectByProperty('uuid', uuid)
      : root.getObjectByName(name as string);

    if (found === undefined)
    {
      const label = typeof uuid === 'string' ? `uuid ${uuid}` : `name ${name as string}`;

      throw this.error('not_found', `No object matching ${label} in the current scene.`);
    }

    const box = new Box3().setFromObject(found);

    if (box.isEmpty())
    {
      throw this.error('bad_request', `Object "${found.name || found.uuid}" has no geometry, so its bounds are empty.`);
    }

    return box;
  }

  private text(value: unknown): string
  {
    if (typeof value !== 'string' || value.length === 0)
    {
      throw this.error('bad_request', 'label needs a non-empty text.');
    }

    return value;
  }

  private position(value: unknown): Vector3
  {
    if (value === undefined)
    {
      return new Vector3();
    }

    if (!Array.isArray(value) || value.length !== 3 || !value.every((n) => typeof n === 'number' && Number.isFinite(n)))
    {
      throw this.error('bad_request', 'position must be [x, y, z] with finite numbers.');
    }

    return new Vector3(value[0] as number, value[1] as number, value[2] as number);
  }

  private size(value: unknown): number
  {
    if (value === undefined)
    {
      return 1;
    }

    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0)
    {
      throw this.error('bad_request', 'size must be a positive finite number.');
    }

    return value;
  }

  private color(value: unknown): Color | undefined
  {
    if (value === undefined || typeof value === 'number' || typeof value === 'string')
    {
      return value as Color | undefined;
    }

    throw this.error('bad_request', 'color must be a number or a string.');
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { DebugDrawer };
