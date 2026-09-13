import type { InspectableObject, InspectableVector } from './SceneInspector';

const PRECISION = 10000;

export interface NodeSelector
{
  uuid?: unknown;
  name?: unknown;
}

// Changes arrive off the dev-bridge wire, so every value is validated.
export interface NodeChanges
{
  position?: unknown;
  rotation?: unknown;
  scale?: unknown;
  visible?: unknown;
}

export interface NodeDetail
{
  uuid: string;
  name: string;
  type: string;
  parent: string | null;
  children: number;
  visible: boolean;
  position: number[];
  rotation: number[];
  scale: number[];
  material?: string;
  vertices?: number;
  changed?: string[];
}

// Finds and mutates individual scene nodes. Mutation returns the resulting
// state rather than an acknowledgement, so the caller never has to guess
// whether a change took.
class SceneEditor
{
  get(root: InspectableObject, selector: NodeSelector): NodeDetail
  {
    const found = this.require(root, selector);

    return this.describe(found.node, found.parent);
  }

  set(root: InspectableObject, selector: NodeSelector, changes: NodeChanges): NodeDetail
  {
    const found = this.require(root, selector);
    const changed: string[] = [];

    if (this.apply_vector(found.node.position, changes.position))
    {
      changed.push('position');
    }

    if (this.apply_vector(found.node.rotation, changes.rotation))
    {
      changed.push('rotation');
    }

    if (this.apply_vector(found.node.scale, changes.scale))
    {
      changed.push('scale');
    }

    if (typeof changes.visible === 'boolean')
    {
      found.node.visible = changes.visible;
      changed.push('visible');
    }

    const detail = this.describe(found.node, found.parent);
    detail.changed = changed;

    return detail;
  }

  private require(root: InspectableObject, selector: NodeSelector): { node: InspectableObject; parent: InspectableObject | null }
  {
    if (typeof root !== 'object' || root === null)
    {
      throw this.error('not_found', 'No scene is set. SceneManager.current is empty.');
    }

    const uuid = typeof selector.uuid === 'string' ? selector.uuid : null;
    const name = typeof selector.name === 'string' ? selector.name : null;

    if (uuid === null && name === null)
    {
      throw this.error('not_found', 'Pass a uuid or a name to identify the object.');
    }

    const found = this.find(root, null, uuid, name);

    if (found === null)
    {
      const label = uuid === null ? `name '${name === null ? '' : name}'` : `uuid '${uuid}'`;

      throw this.error('not_found', `No object matching ${label} in the current scene.`);
    }

    return found;
  }

  // uuid wins when both are supplied: it is unique, names are not.
  private find(
    node: InspectableObject,
    parent: InspectableObject | null,
    uuid: string | null,
    name: string | null
  ): { node: InspectableObject; parent: InspectableObject | null } | null
  {
    const matches = uuid !== null
      ? node.uuid === uuid
      : node.name === name;

    if (matches)
    {
      return { node, parent };
    }

    const children = Array.isArray(node.children) ? node.children : [];

    for (const child of children)
    {
      const found = this.find(child, node, uuid, name);

      if (found !== null)
      {
        return found;
      }
    }

    return null;
  }

  private apply_vector(target: InspectableVector | undefined, values: unknown): boolean
  {
    if (typeof target !== 'object' || target === null || !Array.isArray(values))
    {
      return false;
    }

    const axes: Array<keyof InspectableVector> = ['x', 'y', 'z'];
    // Array.isArray narrows to any[]; restate it as unknown[] so each element
    // has to be checked rather than trusted.
    const supplied = values as unknown[];
    let applied = false;

    for (let i = 0; i < axes.length; i++)
    {
      const value = supplied[i];

      // Anything non-numeric is skipped rather than coerced, so a bad payload
      // cannot silently move an object to NaN.
      if (typeof value === 'number' && Number.isFinite(value))
      {
        target[axes[i]] = value;
        applied = true;
      }
    }

    return applied;
  }

  private describe(node: InspectableObject, parent: InspectableObject | null): NodeDetail
  {
    const detail: NodeDetail = {
      uuid: typeof node.uuid === 'string' ? node.uuid : '(no uuid)',
      name: typeof node.name === 'string' ? node.name : '',
      type: typeof node.type === 'string' ? node.type : 'Object3D',
      parent: this.parent_label(parent),
      children: Array.isArray(node.children) ? node.children.length : 0,
      visible: node.visible !== false,
      position: this.vector(node.position, 0),
      rotation: this.vector(node.rotation, 0),
      scale: this.vector(node.scale, 1)
    };

    const material = this.material_type(node.material);

    if (material !== null)
    {
      detail.material = material;
    }

    const vertices = this.vertices(node.geometry);

    if (vertices !== null)
    {
      detail.vertices = vertices;
    }

    return detail;
  }

  // Prefers a readable name, falls back to uuid, so the caller can always
  // identify the parent it was told about.
  private parent_label(parent: InspectableObject | null): string | null
  {
    if (parent === null)
    {
      return null;
    }

    if (typeof parent.name === 'string' && parent.name.length > 0)
    {
      return parent.name;
    }

    return typeof parent.uuid === 'string' ? parent.uuid : null;
  }

  private material_type(material: unknown): string | null
  {
    if (Array.isArray(material))
    {
      return `${material.length} materials`;
    }

    if (typeof material === 'object' && material !== null)
    {
      const type = (material as { type?: unknown }).type;

      return typeof type === 'string' ? type : 'Material';
    }

    return null;
  }

  private vertices(geometry: unknown): number | null
  {
    if (typeof geometry !== 'object' || geometry === null)
    {
      return null;
    }

    const attributes = (geometry as { attributes?: unknown }).attributes;

    if (typeof attributes !== 'object' || attributes === null)
    {
      return null;
    }

    const position = (attributes as { position?: unknown }).position;

    if (typeof position !== 'object' || position === null)
    {
      return null;
    }

    const count = (position as { count?: unknown }).count;

    return typeof count === 'number' ? count : null;
  }

  private vector(source: InspectableVector | undefined, fallback: number): number[]
  {
    if (typeof source !== 'object' || source === null)
    {
      return [fallback, fallback, fallback];
    }

    return [this.round(source.x, fallback), this.round(source.y, fallback), this.round(source.z, fallback)];
  }

  private round(value: unknown, fallback: number): number
  {
    if (typeof value !== 'number' || !Number.isFinite(value))
    {
      return fallback;
    }

    return Math.round(value * PRECISION) / PRECISION;
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { SceneEditor };
