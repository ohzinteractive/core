import { SimpleTextDrawer } from '../canvas_drawer/SimpleTextDrawer';
import { WorldImage } from './WorldImage';

import type { CanvasTexture, Vector2 } from 'three';
import { LinearFilter, LinearMipMapLinearFilter } from 'three';

class Text2D extends WorldImage
{
  canvas_texture: CanvasTexture;
  draw_settings: { font: string; font_color: string | number; };
  simple_text_drawer: SimpleTextDrawer;

  constructor(text: string, font: string, color: string | number, pivot: Vector2) 
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
