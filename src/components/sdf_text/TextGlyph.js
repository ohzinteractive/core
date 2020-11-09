import { Vector2, Vector4} from 'three';

export default class TextGlyph
{
  constructor(offset, plane_bounds, atlas_bounds)
  {
    let width   = plane_bounds.right - plane_bounds.left;
    let height  = plane_bounds.top   - plane_bounds.bottom;

    this.scale    = new Vector2(width, height);
    this.position = new Vector2(offset+ plane_bounds.left, plane_bounds.bottom);

    this.atlas_bounds = new Vector4(atlas_bounds.left, atlas_bounds.right, atlas_bounds.top, atlas_bounds.bottom);
  }




}
