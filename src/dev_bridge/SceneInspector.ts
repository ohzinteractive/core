const DEFAULT_DEPTH = 4;
const DEFAULT_MAX_NODES = 200;
const PRECISION = 10000;

export interface InspectableVector
{
  x: number;
  y: number;
  z: number;
}

export interface InspectableObject
{
  uuid?: string;
  name?: string;
  type?: string;
  visible?: boolean;
  position?: InspectableVector;
  rotation?: InspectableVector;
  scale?: InspectableVector;
  children?: InspectableObject[];
  material?: unknown;
  geometry?: unknown;
}

export interface SceneNode
{
  uuid: string;
  name: string;
  type: string;
  position: number[];
  rotation?: number[];
  scale?: number[];
  visible?: boolean;
  material?: string;
  vertices?: number;
  children?: SceneNode[];
  truncated?: string;
}

// Options arrive off the dev-bridge wire and are therefore untrusted.
export interface InspectOptions
{
  depth?: unknown;
  max_nodes?: unknown;
  filter?: unknown;
}

export interface SceneInspectionResult
{
  root: SceneNode | null;
  counts: { total: number; meshes: number; returned: number };
  truncated: boolean;
  notes: string[];
}

interface Budget
{
  used: number;
  depth_cut: boolean;
  node_cut: boolean;
}

// Serialises a Three.js scene graph under a hard budget. A production scene has
// thousands of nodes; an uncapped traversal would consume an entire context
// window, so depth and node count are always bounded and what was dropped is
// always reported.
class SceneInspector
{
  inspect(root: InspectableObject, options: InspectOptions): SceneInspectionResult
  {
    if (typeof root !== 'object' || root === null)
    {
      return {
        root: null,
        counts: { total: 0, meshes: 0, returned: 0 },
        truncated: false,
        notes: ['No scene is set. SceneManager.current is empty.']
      };
    }

    const depth = this.positive(options.depth, DEFAULT_DEPTH);
    const max_nodes = this.positive(options.max_nodes, DEFAULT_MAX_NODES);
    const filter = typeof options.filter === 'string' && options.filter.length > 0
      ? options.filter.toLowerCase()
      : null;

    const notes: string[] = [];
    const counts = this.count(root);

    let keep: Set<InspectableObject> | null = null;

    if (filter !== null)
    {
      keep = new Set<InspectableObject>();
      this.mark(root, filter, keep);

      if (keep.size === 0)
      {
        notes.push(`no nodes matched the filter '${filter}'`);
        keep = new Set<InspectableObject>([root]);
      }
    }

    const budget: Budget = { used: 0, depth_cut: false, node_cut: false };
    const serialised = this.serialise(root, 0, depth, max_nodes, keep, budget);

    if (budget.node_cut)
    {
      notes.push(`stopped at max_nodes=${max_nodes}; ${counts.total - budget.used} of ${counts.total} nodes not returned`);
    }

    if (budget.depth_cut)
    {
      notes.push(`stopped at depth=${depth}; deeper nodes not returned`);
    }

    return {
      root: serialised,
      counts: { total: counts.total, meshes: counts.meshes, returned: budget.used },
      truncated: budget.node_cut || budget.depth_cut,
      notes
    };
  }

  private serialise(
    source: InspectableObject,
    level: number,
    depth: number,
    max_nodes: number,
    keep: Set<InspectableObject> | null,
    budget: Budget
  ): SceneNode | null
  {
    if (keep !== null && !keep.has(source))
    {
      return null;
    }

    if (budget.used >= max_nodes)
    {
      budget.node_cut = true;
      return null;
    }

    budget.used++;

    const node: SceneNode = {
      uuid: typeof source.uuid === 'string' ? source.uuid : '(no uuid)',
      name: typeof source.name === 'string' ? source.name : '',
      type: typeof source.type === 'string' ? source.type : 'Object3D',
      position: this.vector(source.position, 0)
    };

    // Defaults are omitted so the payload carries only what differs.
    const rotation = this.vector(source.rotation, 0);
    const scale = this.vector(source.scale, 1);

    if (!this.is_uniform(rotation, 0))
    {
      node.rotation = rotation;
    }

    if (!this.is_uniform(scale, 1))
    {
      node.scale = scale;
    }

    if (source.visible === false)
    {
      node.visible = false;
    }

    const material = this.describe_material(source.material);

    if (material !== null)
    {
      node.material = material;
    }

    const vertices = this.count_vertices(source.geometry);

    if (vertices !== null)
    {
      node.vertices = vertices;
    }

    const children = Array.isArray(source.children) ? source.children : [];

    if (children.length === 0)
    {
      return node;
    }

    if (level + 1 > depth)
    {
      budget.depth_cut = true;
      node.truncated = `${children.length} children hidden (depth limit ${depth})`;

      return node;
    }

    const serialised: SceneNode[] = [];
    let hidden = 0;

    for (const child of children)
    {
      const child_node = this.serialise(child, level + 1, depth, max_nodes, keep, budget);

      if (child_node === null)
      {
        hidden++;
        continue;
      }

      serialised.push(child_node);
    }

    if (serialised.length > 0)
    {
      node.children = serialised;
    }

    // Only meaningful when nothing was filtered out on purpose.
    if (hidden > 0 && keep === null)
    {
      node.truncated = `${hidden} children hidden (max_nodes ${max_nodes})`;
    }

    return node;
  }

  private count(root: InspectableObject): { total: number; meshes: number }
  {
    let total = 0;
    let meshes = 0;

    const stack: InspectableObject[] = [root];

    while (stack.length > 0)
    {
      const current = stack.pop();

      if (typeof current !== 'object' || current === null)
      {
        continue;
      }

      total++;

      if (current.type === 'Mesh')
      {
        meshes++;
      }

      const children = Array.isArray(current.children) ? current.children : [];

      for (const child of children)
      {
        stack.push(child);
      }
    }

    return { total, meshes };
  }

  // A node is kept when it matches, or when any descendant matches, so the
  // path to a match stays visible.
  private mark(source: InspectableObject, filter: string, keep: Set<InspectableObject>): boolean
  {
    const name = typeof source.name === 'string' ? source.name.toLowerCase() : '';
    const type = typeof source.type === 'string' ? source.type.toLowerCase() : '';

    let matched = name.includes(filter) || type.includes(filter);

    const children = Array.isArray(source.children) ? source.children : [];

    for (const child of children)
    {
      if (this.mark(child, filter, keep))
      {
        matched = true;
      }
    }

    if (matched)
    {
      keep.add(source);
    }

    return matched;
  }

  private describe_material(material: unknown): string | null
  {
    if (Array.isArray(material))
    {
      const types = material.map((entry) => this.material_type(entry));

      return `${material.length} materials: ${types.join(', ')}`;
    }

    if (typeof material === 'object' && material !== null)
    {
      return this.material_type(material);
    }

    return null;
  }

  private material_type(material: unknown): string
  {
    if (typeof material === 'object' && material !== null)
    {
      const type = (material as { type?: unknown }).type;

      if (typeof type === 'string')
      {
        return type;
      }
    }

    return 'Material';
  }

  private count_vertices(geometry: unknown): number | null
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

  private is_uniform(values: number[], expected: number): boolean
  {
    return values.every((value) => value === expected);
  }

  private positive(value: unknown, fallback: number): number
  {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 1)
    {
      return fallback;
    }

    return Math.floor(value);
  }
}

export { SceneInspector };
