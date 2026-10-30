import type { Object3D, Texture } from 'three';
import { Box3, Sphere, Vector3 } from 'three';
type Color = number | string;
interface DebugLike {
    draw_cube(pos?: Vector3, size?: number, color?: Color): Object3D;
    draw_sphere(pos: Vector3, size: number, color?: Color): Object3D;
    draw_plane(width?: number, height?: number, color?: Color): Object3D;
    draw_math_sphere(sphere: Sphere, color?: Color): Object3D;
    draw_bounding_box(bb: Box3, color?: Color): Object3D;
    draw_label(text: string, pos?: Vector3, size?: number, color?: Color): Object3D;
    scene: Object3D;
}
interface DebugDrawRequest {
    shape?: unknown;
    position?: unknown;
    size?: unknown;
    color?: unknown;
    object?: unknown;
    text?: unknown;
    font?: unknown;
}
interface SDFFont {
    layout: unknown;
    atlas: Texture;
}
type SDFFontLoader = (layout_url: string, atlas_url: string) => Promise<SDFFont>;
interface DebugDrawerOptions {
    sdf_font?: string;
    load_sdf_font?: SDFFontLoader;
}
interface DebugDrawResult {
    id: string;
    shape: string;
    helpers: number;
}
interface DebugClearRequest {
    id?: unknown;
}
interface DebugClearResult {
    removed: number;
    helpers: number;
}
declare class DebugDrawer {
    private helpers;
    private sdf_font;
    private load_sdf_font;
    private sdf_fonts;
    constructor(options?: DebugDrawerOptions);
    draw(debug: DebugLike, root: Object3D, request: DebugDrawRequest): DebugDrawResult | Promise<DebugDrawResult>;
    private track;
    private draw_sdf_text;
    private font;
    private font_url;
    private sdf_layout;
    private build;
    clear(request: DebugClearRequest): DebugClearResult;
    private dispose;
    private bounds;
    private text;
    private position;
    private size;
    private color;
    private error;
}
export { DebugDrawer };
