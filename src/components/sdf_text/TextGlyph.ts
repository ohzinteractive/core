import { Vector2, Vector4 } from 'three';

class TextGlyph
{
  atlas_bounds: any;
  position: any;
  scale: any;
  constructor(offset: any, plane_bounds: any, atlas_bounds: any)
  {
    const width   = plane_bounds.right - plane_bounds.left;
    const height  = plane_bounds.top   - plane_bounds.bottom;

    this.scale    = new Vector2(width, height);
    this.position = new Vector2(offset + plane_bounds.left, plane_bounds.bottom);

    this.atlas_bounds = new Vector4(atlas_bounds.left, atlas_bounds.right, atlas_bounds.top, atlas_bounds.bottom);
  }
}

export { TextGlyph };
