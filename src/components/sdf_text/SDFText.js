import { Vector3, Quaternion, Matrix4, Color } from 'three';
import TextGlyph from './TextGlyph';

export default class SDFText
{
  constructor(glyph_layout, text = "")
  {
    this.glyph_layout = glyph_layout;

    this.glyphs = [];

    this.glyph_is_dirty  = true;
    this.matrix_is_dirty = true;
    this.color_is_dirty  = true;

    this.position = new Vector3();
    this.quaternion = new Quaternion();
    this.scale = new Vector3(1,1,1);
    this.matrix = new Matrix4();

    this.color = new Color("#FFFFFF");
    this.__opacity = 1;

    this.__text   = text;


    this.__generate_glyphs(text);
  }

  set text(value)
  {
    this.__text = value;
    this.__generate_glyphs(value);
  }

  get text()
  {
    return this.__text;
  }

  update_matrix()
  {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.matrix_is_dirty = false;
    this.glyph_is_dirty = true;
  }

  clear_glyph_dirty()
  {
    this.glyph_is_dirty = false;
  }
  clear_color_dirty()
  {
    this.color_is_dirty = false;
  }

  set_rotation(orientation = 0, tilt = 0) //0..360, -90..0..90
  {
    let new_orientation = new Quaternion().setFromAxisAngle(new Vector3(0,1,0), (orientation / 360) * Math.PI * 2);
    let new_tilt = new Quaternion().setFromAxisAngle(new Vector3(1,0,0), (-tilt / 360) * Math.PI * 2);

    this.quaternion.copy(new_orientation.multiply(new_tilt));
    this.matrix_is_dirty = true;
  }

  set_position(pos)
  {
    this.position.copy(pos);
    this.matrix_is_dirty = true;
  }

  set_size(size)
  {
    this.scale.set(size, size, size);
    this.matrix_is_dirty = true;
  }

  set_color(col)
  {
    this.color.set(col);
    this.color_is_dirty = true;
  }
  set opacity(op)
  {
    this.__opacity = op;
    this.color_is_dirty = true;
  }
  get opacity()
  {
    return this.__opacity;
  }

  __generate_glyphs(text)
  {
    let cursor = 0;

    this.glyphs.length = 0;

    for(let i=0; i< text.length; i++)
    {
      let unicode = text.charCodeAt(i);
      let glyph = this.glyph_layout.find(element => element.unicode === unicode);
      if(glyph)
      {
        if(glyph.planeBounds)
        {
          let text_glyph = new TextGlyph(cursor, glyph.planeBounds, glyph.atlasBounds)
          this.glyphs.push(text_glyph);
        }
        cursor += glyph.advance;
      }

    }
    
    this.glyph_is_dirty = true;
  }


}