import { Vector3, Quaternion, Matrix4, Color, Box2, Vector2 } from 'three';
import { TextGlyph } from './TextGlyph';

class SDFText
{
  constructor(glyph_layout, text = '')
  {
    this.glyph_layout = glyph_layout;

    this.glyphs = [];

    this.glyph_is_dirty  = true;
    this.matrix_is_dirty = true;
    this.color_is_dirty  = true;

    this.position = new Vector3();
    this.quaternion = new Quaternion();
    this.scale = new Vector3(1, 1, 1);
    this.matrix = new Matrix4();

    this.color = new Color('#FFFFFF');

    this.pivot_point = new Vector2();
    this.__opacity = 1;

    this.__text   = text;

    this.__generate_glyphs(text);
  }

  set text(value)
  {
    this.__text = value;
    this.__generate_glyphs(value);
    this.matrix_is_dirty = true;
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

  set_rotation(orientation = 0, tilt = 0) // 0..360, -90..0..90
  {
    const new_orientation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), (orientation / 360) * Math.PI * 2);
    const new_tilt = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), (-tilt / 360) * Math.PI * 2);

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

  set_pivot(pivot)
  {
    this.pivot_point.copy(pivot);
    this.update_glyphs();
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

  update_glyphs()
  {
    this.__generate_glyphs(this.text);
  }

  __generate_glyphs(text)
  {
    let cursor = 0;

    this.glyphs.length = 0;

    for (let i = 0; i < text.length; i++)
    {
      const unicode = text.charCodeAt(i);
      const glyph = this.glyph_layout.find(element => element.unicode === unicode);
      if (glyph)
      {
        if (glyph.planeBounds)
        {
          const text_glyph = new TextGlyph(cursor, glyph.planeBounds, glyph.atlasBounds);
          this.glyphs.push(text_glyph);
        }
        cursor += glyph.advance;
      }
    }

    const box2 = new Box2();
    const first_glyph = this.glyphs[0];
    box2.setFromCenterAndSize(first_glyph.position.clone().add(new Vector2(first_glyph.scale.x / 2, first_glyph.scale.y / 2)), first_glyph.scale);

    for (let i = 1; i < this.glyphs.length; i++)
    {
      const g = this.glyphs[i];
      const box = new Box2().setFromCenterAndSize(g.position.clone().add(new Vector2(g.scale.x / 2, g.scale.y / 2)), g.scale);
      box2.union(box);
    }

    const box2_size = new Vector2();
    box2.getSize(box2_size);
    for (let i = 0; i < this.glyphs.length; i++)
    {
      this.glyphs[i].position.x -= box2_size.x / 2;
      this.glyphs[i].position.y -= box2_size.y / 2;

      this.glyphs[i].position.x += (box2_size.x / 2) * this.pivot_point.x;
      this.glyphs[i].position.y += (box2_size.y / 2) * this.pivot_point.y;
    }

    this.glyph_is_dirty = true;
  }
}

export { SDFText };
