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

// Arrives off the dev-bridge wire, so every value is validated. Colors are sRGB
// hex strings, '#ff8800' or 'ff8800'.
export interface MaterialChanges
{
  color?: unknown;
  roughness?: unknown;
  metalness?: unknown;
  emissive?: unknown;
  emissive_intensity?: unknown;
  opacity?: unknown;
  transparent?: unknown;
  wireframe?: unknown;
}

export interface MaterialDetail
{
  uuid: string;
  name: string;
  type: string;
  // Meshes in the scene that render with this material. More than one means an
  // edit shows up on all of them.
  users: number;
  color?: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissive_intensity?: number;
  opacity: number;
  transparent: boolean;
  wireframe?: boolean;
}

export interface MaterialEditResult
{
  target: string;
  meshes: number;
  materials: MaterialDetail[];
  changed: string[];
  notes: string[];
}

interface EditableColor
{
  setHex(hex: number): unknown;
  getHexString(): string;
}

type EditableMaterial = Record<string, unknown> & { uuid?: unknown; name?: unknown; type?: unknown; needsUpdate?: boolean };

type MaterialField = keyof MaterialChanges;

// Wire field, the Three.js property it maps to, and the TSL node input that
// replaces that property when set.
const MATERIAL_FIELDS: Array<{ field: MaterialField; property: string; kind: 'color' | 'unit' | 'non_negative' | 'boolean'; node?: string }> = [
  { field: 'color', property: 'color', kind: 'color', node: 'colorNode' },
  { field: 'roughness', property: 'roughness', kind: 'unit', node: 'roughnessNode' },
  { field: 'metalness', property: 'metalness', kind: 'unit', node: 'metalnessNode' },
  { field: 'emissive', property: 'emissive', kind: 'color', node: 'emissiveNode' },
  { field: 'emissive_intensity', property: 'emissiveIntensity', kind: 'non_negative' },
  { field: 'opacity', property: 'opacity', kind: 'unit', node: 'opacityNode' },
  // After opacity, so an explicit transparent wins over the one opacity implies.
  { field: 'transparent', property: 'transparent', kind: 'boolean' },
  { field: 'wireframe', property: 'wireframe', kind: 'boolean' }
];

const HEX_COLOR = /^#?([0-9a-f]{6})$/i;

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

  // Edits the materials of one object in place. An object without a material of
  // its own, such as an imported model's root, has every material under it
  // edited instead; an object with one keeps its children untouched. Each material is edited once even when several meshes share
  // it, and those meshes all change with it.
  set_material(root: InspectableObject, selector: NodeSelector, changes: MaterialChanges): MaterialEditResult
  {
    const found = this.require(root, selector);
    const meshes = typeof found.node.material === 'object' && found.node.material !== null
      ? [found.node]
      : this.material_users(found.node, []);
    const materials = this.unique_materials(meshes);

    if (materials.length === 0)
    {
      throw this.error('not_found', `'${this.label(found.node)}' has no material, and neither does anything under it.`);
    }

    const changed: string[] = [];
    const notes: string[] = [];

    for (const spec of MATERIAL_FIELDS)
    {
      const value = this.material_value(spec.kind, changes[spec.field]);

      if (value === undefined)
      {
        continue;
      }

      let applied = false;

      for (const material of materials)
      {
        if (!this.apply_material_value(material, spec.property, spec.kind, value))
        {
          notes.push(`${spec.field}: ${this.text(material.type, 'Material')} has no ${spec.field}, skipped.`);
          continue;
        }

        applied = true;

        if (spec.node !== undefined && material[spec.node] !== null && material[spec.node] !== undefined)
        {
          notes.push(`${spec.field}: ${this.text(material.type, 'Material')} has ${spec.node} set, which replaces ${spec.field}, so the change may not show.`);
        }
      }

      if (applied)
      {
        changed.push(spec.field);
      }
    }

    const all_meshes = this.material_users(root, []);

    return {
      target: this.label(found.node),
      meshes: meshes.length,
      materials: materials.map((material) => this.describe_material(material, all_meshes)),
      changed,
      notes: [...new Set(notes)]
    };
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

  // Collects every node under (and including) node that renders with a
  // material into users.
  private material_users(node: InspectableObject, users: InspectableObject[]): InspectableObject[]
  {
    if (typeof node.material === 'object' && node.material !== null)
    {
      users.push(node);
    }

    const children = Array.isArray(node.children) ? node.children : [];

    for (const child of children)
    {
      this.material_users(child, users);
    }

    return users;
  }

  private unique_materials(nodes: InspectableObject[]): EditableMaterial[]
  {
    const materials = new Set<EditableMaterial>();

    for (const node of nodes)
    {
      for (const material of this.materials_of(node))
      {
        materials.add(material);
      }
    }

    return [...materials];
  }

  private materials_of(node: InspectableObject): EditableMaterial[]
  {
    const list = Array.isArray(node.material) ? node.material as unknown[] : [node.material];

    return list.filter((material): material is EditableMaterial => typeof material === 'object' && material !== null);
  }

  // Returns undefined for anything invalid, so a bad payload is skipped rather
  // than coerced.
  private material_value(kind: 'color' | 'unit' | 'non_negative' | 'boolean', value: unknown): number | boolean | undefined
  {
    if (kind === 'boolean')
    {
      return typeof value === 'boolean' ? value : undefined;
    }

    if (kind === 'color')
    {
      const match = typeof value === 'string' ? HEX_COLOR.exec(value) : null;

      return match === null ? undefined : parseInt(match[1], 16);
    }

    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0)
    {
      return undefined;
    }

    return kind === 'unit' && value > 1 ? undefined : value;
  }

  private apply_material_value(material: EditableMaterial, property: string, kind: 'color' | 'unit' | 'non_negative' | 'boolean', value: number | boolean): boolean
  {
    const current = material[property];

    if (kind === 'color')
    {
      if (!this.is_color(current))
      {
        return false;
      }

      // setHex reads sRGB and stores it in the working color space, the same as
      // passing the hex to the material's constructor.
      current.setHex(value as number);

      return true;
    }

    if (typeof current !== typeof value)
    {
      return false;
    }

    material[property] = value;

    // Transparency and wireframe are part of the compiled pipeline, so the
    // material has to be rebuilt for them to show. Below 1, opacity only shows
    // on a transparent material.
    if ((property === 'wireframe' || property === 'transparent') && current !== value)
    {
      material.needsUpdate = true;
    }

    if (property === 'opacity' && (value as number) < 1 && material.transparent !== true)
    {
      material.transparent = true;
      material.needsUpdate = true;
    }

    return true;
  }

  private describe_material(material: EditableMaterial, scene_meshes: InspectableObject[]): MaterialDetail
  {
    const detail: MaterialDetail = {
      uuid: this.text(material.uuid, '(no uuid)'),
      name: this.text(material.name, ''),
      type: this.text(material.type, 'Material'),
      users: scene_meshes.filter((mesh) => this.materials_of(mesh).includes(material)).length,
      opacity: this.round(material.opacity, 1),
      transparent: material.transparent === true
    };

    if (this.is_color(material.color))
    {
      detail.color = `#${material.color.getHexString()}`;
    }

    if (typeof material.roughness === 'number')
    {
      detail.roughness = this.round(material.roughness, 0);
    }

    if (typeof material.metalness === 'number')
    {
      detail.metalness = this.round(material.metalness, 0);
    }

    if (this.is_color(material.emissive))
    {
      detail.emissive = `#${material.emissive.getHexString()}`;
    }

    if (typeof material.emissiveIntensity === 'number')
    {
      detail.emissive_intensity = this.round(material.emissiveIntensity, 0);
    }

    if (typeof material.wireframe === 'boolean')
    {
      detail.wireframe = material.wireframe;
    }

    return detail;
  }

  private is_color(value: unknown): value is EditableColor
  {
    return typeof value === 'object' && value !== null
      && typeof (value as { setHex?: unknown }).setHex === 'function'
      && typeof (value as { getHexString?: unknown }).getHexString === 'function';
  }

  private label(node: InspectableObject): string
  {
    if (typeof node.name === 'string' && node.name.length > 0)
    {
      return node.name;
    }

    return this.text(node.uuid, '(unnamed)');
  }

  private text(value: unknown, fallback: string): string
  {
    return typeof value === 'string' ? value : fallback;
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
