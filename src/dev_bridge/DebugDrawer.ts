import { SDFTextBatch } from '../components/sdf_text/SDFTextBatch';
import { WorldImage } from '../components/WorldImage';

import type { Material, Mesh, Object3D, Texture } from 'three';
import { Box3, Color as ThreeColor, Sphere, TextureLoader, Vector3 } from 'three';

type Color = number | string;

interface DebugLike
{
  draw_cube(pos?: Vector3, size?: number, color?: Color): Object3D;
  draw_sphere(pos: Vector3, size: number, color?: Color): Object3D;
  draw_plane(width?: number, height?: number, color?: Color): Object3D;
  draw_math_sphere(sphere: Sphere, color?: Color): Object3D;
  draw_bounding_box(bb: Box3, color?: Color): Object3D;
  draw_label(text: string, pos?: Vector3, size?: number, color?: Color): Object3D;
  scene: Object3D;
}

interface DebugDrawRequest
{
  shape?: unknown;
  position?: unknown;
  size?: unknown;
  color?: unknown;
  object?: unknown;
  text?: unknown;
  font?: unknown;
}

// An msdf-atlas-gen layout (the JSON it writes with -json) and its atlas image.
interface SDFFont
{
  layout: unknown;
  atlas: Texture;
}

type SDFFontLoader = (layout_url: string, atlas_url: string) => Promise<SDFFont>;

interface DebugDrawerOptions
{
  // URL of the font sdf_text uses when the request names none.
  sdf_font?: string;
  // Loads a font. Defaults to fetching the layout and loading the atlas image.
  load_sdf_font?: SDFFontLoader;
}

interface SDFGlyph
{
  unicode: number;
  planeBounds?: unknown;
}

interface SDFLayout
{
  atlas: { width: number, height: number, yOrigin?: string };
  glyphs: SDFGlyph[];
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

const SHAPES = ['cube', 'sphere', 'plane', 'math_sphere', 'bounding_box', 'label', 'sdf_text'];

// At 48px a glyph is about 27 pixels wide, so 200 keeps the label canvas below the
// 8192 pixel texture limit WebGPU guarantees.
const MAX_LABEL_LENGTH = 200;

async function load_sdf_font(layout_url: string, atlas_url: string): Promise<SDFFont>
{
  const response = await fetch(layout_url);

  if (!response.ok)
  {
    throw new Error(`HTTP ${response.status}`);
  }

  // TextureLoader rejects with the image's error event, which says nothing useful.
  const atlas_request = new TextureLoader().loadAsync(atlas_url).catch(() =>
  {
    throw new Error(`no atlas image at ${atlas_url}`);
  });
  const [layout, atlas] = await Promise.all([response.json() as Promise<unknown>, atlas_request]);

  return { layout, atlas };
}

// Only helpers drawn through this class are tracked, so debug_clear never touches the
// helpers the app draws for itself into Debug.scene.
class DebugDrawer
{
  private helpers = new Map<string, Object3D>();
  private sdf_font: string | undefined;
  private load_sdf_font: SDFFontLoader;
  // Loaded fonts by layout URL. Every sdf_text helper shares its font's atlas, so
  // clearing a helper never disposes it.
  private sdf_fonts = new Map<string, Promise<SDFFont>>();

  constructor(options: DebugDrawerOptions = {})
  {
    this.sdf_font = options.sdf_font;
    this.load_sdf_font = options.load_sdf_font ?? load_sdf_font;
  }

  // sdf_text loads its font first, so it resolves later. Every other shape draws now.
  draw(debug: DebugLike, root: Object3D, request: DebugDrawRequest): DebugDrawResult | Promise<DebugDrawResult>
  {
    const shape = typeof request.shape === 'string' && SHAPES.includes(request.shape) ? request.shape : null;

    if (shape === null)
    {
      throw this.error('bad_request', `Unknown shape. Valid shapes: ${SHAPES.join(', ')}.`);
    }

    const position = this.position(request.position);
    const size = this.size(request.size);
    const color = this.color(request.color);

    if (shape === 'sdf_text')
    {
      return this.draw_sdf_text(debug, this.text(request.text), this.font_url(request.font), position, size, color);
    }

    return this.track(shape, this.build(debug, root, shape, request, position, size, color));
  }

  private track(shape: string, helper: Object3D): DebugDrawResult
  {
    this.helpers.set(helper.uuid, helper);

    return { id: helper.uuid, shape, helpers: this.helpers.size };
  }

  private async draw_sdf_text(debug: DebugLike, text: string, font_url: string, position: Vector3, size: number, color: Color | undefined): Promise<DebugDrawResult>
  {
    const font = await this.font(font_url);
    const layout = this.sdf_layout(font.layout, font_url);

    if (![...text].some((character) => layout.glyphs.some((glyph) => glyph.unicode === character.codePointAt(0) && glyph.planeBounds !== undefined)))
    {
      throw this.error('bad_request', `The font at ${font_url} has none of the characters of the text.`);
    }

    // One batch per helper, so debug_clear can remove each text on its own.
    const batch = new SDFTextBatch(layout, font.atlas);
    const element = batch.add_text(text);
    element.set_position(position);
    element.set_size(size);
    element.set_color(new ThreeColor(color ?? 0xffffff));
    // The text never changes, so one upload is enough.
    batch.update(true);
    debug.scene.add(batch);

    return this.track('sdf_text', batch);
  }

  private font(url: string): Promise<SDFFont>
  {
    let font = this.sdf_fonts.get(url);

    if (font === undefined)
    {
      font = this.load_sdf_font(url, url.replace(/\.json(?=$|[?#])/, '.png')).catch((cause: unknown) =>
      {
        // Forget the failure, so the next request tries again.
        this.sdf_fonts.delete(url);

        const reason = cause instanceof Error ? cause.message : typeof cause === 'string' ? cause : 'unknown error';

        throw this.error('not_found', `Could not load the SDF font at ${url}: ${reason}`);
      });

      this.sdf_fonts.set(url, font);
    }

    return font;
  }

  private font_url(value: unknown): string
  {
    if (value === undefined && this.sdf_font === undefined)
    {
      throw this.error('bad_request', 'sdf_text needs a font: no default SDF font is configured.');
    }

    const url = value ?? this.sdf_font;

    if (typeof url !== 'string' || !/\.json(?=$|[?#])/.test(url))
    {
      throw this.error('bad_request', 'font must be the URL of an msdf-atlas-gen .json layout, with its .png atlas next to it.');
    }

    return url;
  }

  private sdf_layout(value: unknown, url: string): SDFLayout
  {
    const layout = value as Partial<SDFLayout> | null;

    if (typeof layout?.atlas?.width !== 'number' || typeof layout.atlas.height !== 'number' || !Array.isArray(layout.glyphs))
    {
      throw this.error('bad_request', `The font at ${url} is not an msdf-atlas-gen layout.`);
    }

    // The material maps atlas bounds counted from the bottom.
    if (layout.atlas.yOrigin === 'top')
    {
      throw this.error('bad_request', `The font at ${url} has yOrigin top. Generate it with -yorigin bottom.`);
    }

    return layout as SDFLayout;
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
    if (typeof value !== 'string' || value.length === 0 || value.length > MAX_LABEL_LENGTH)
    {
      throw this.error('bad_request', `label and sdf_text need a text of 1 to ${MAX_LABEL_LENGTH} characters.`);
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
