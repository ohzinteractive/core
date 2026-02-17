import { Vector2, Vector4 } from 'three';
declare class TextGlyph {
    atlas_bounds: Vector4;
    position: Vector2;
    scale: Vector2;
    constructor(offset: number, plane_bounds: any, atlas_bounds: any);
}
export { TextGlyph };
