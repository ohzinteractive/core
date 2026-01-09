
import { SimpleTextDrawer } from '../canvas_drawer/SimpleTextDrawer';
import { WorldImage } from './WorldImage';

import { LinearFilter, LinearMipMapLinearFilter, Vector2 } from 'three';

class Text2D extends WorldImage
{
  canvas_texture: any;
  draw_settings: any;
  simple_text_drawer: any;

  constructor(text: string, font: string, color: string | Number, pivot: Vector2) 
  {
    const simple_text_drawer = new SimpleTextDrawer();

    const draw_settings = {
      font: font,
      font_color: color || '#000000'
    };
    const canvas_texture = simple_text_drawer.draw_on_texture(text, draw_settings);

    canvas_texture.minFilter = LinearMipMapLinearFilter;
    canvas_texture.minFilter = LinearFilter;
    canvas_texture.needsUpdate = true;
    super(canvas_texture, pivot);

    this.simple_text_drawer = simple_text_drawer;
    this.canvas_texture = canvas_texture;
    this.draw_settings = draw_settings;
  }

  set text(value)
  {
    this.simple_text_drawer.draw_canvas(value, this.draw_settings);
    this.update_texture();
  }

  get text()
  {
    return 'not implemented';
  }
}

export { Text2D };
