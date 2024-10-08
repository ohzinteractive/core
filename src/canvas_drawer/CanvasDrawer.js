// @ts-check
import { CanvasTexture } from 'three';
import { Vector2 } from 'three';
import { UVMapping } from 'three';
import { ClampToEdgeWrapping } from 'three';
import { NearestFilter } from 'three';

class CanvasDrawer
{
  /**
   * @param {boolean} [uses_dynamic_font]
   */
  constructor(uses_dynamic_font)
  {
    this.uses_dynamic_font = !!uses_dynamic_font;
    this.__textHeight = null;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  getFontHeight(fontStyle = 'Arial')
  {
    if (this.__textHeight == null || this.uses_dynamic_font)
    {
      const body = document.getElementsByTagName('body')[0];
      const dummy = document.createElement('div');
      const dummyText = document.createTextNode('MÉqgOLAKTAL');
      dummy.appendChild(dummyText);
      dummy.setAttribute('style', `font:${fontStyle};position:absolute;top:0;left:0`);
      body.appendChild(dummy);
      this.__textHeight = dummy.offsetHeight;
      body.removeChild(dummy);
    }
    return this.__textHeight;
  }

  /**
   * @param {string} text
   * @param {string} font
   */
  get_text_size(text, font = '24px Arial')
  {
    const size = new Vector2();
    this.ctx.font = font;
    size.x = Math.ceil(this.ctx.measureText(text).width);
    size.y = Math.ceil(this.getFontHeight(font));
    return size;
  }

  /**
   * @param {string} text
   * @param {any} [ctxOptions]
   */
  draw_canvas(text, ctxOptions = {})
  {
    ctxOptions.font = ctxOptions.font || '24px Arial';
    ctxOptions.font_color = ctxOptions.font_color || '#000000';

    this.__draw(text, ctxOptions, this.canvas, this.ctx);
    return this.canvas;
  }

  /**
   * @param {string} text
   * @param {any} [ctxOptions]
   */
  draw_on_texture(text, ctxOptions)
  {
    const canvas = this.draw_canvas(text, ctxOptions);
    const canvas_texture = new CanvasTexture(canvas, UVMapping,
      ClampToEdgeWrapping,
      ClampToEdgeWrapping,
      NearestFilter,
      NearestFilter);
    canvas_texture.generateMipmaps = false;
    canvas_texture.needsUpdate = true;

    return canvas_texture;
  }

  /**
   * @param {string[] | string} text
   * @param {any} [ctxOptions]
   * @param {HTMLCanvasElement} [canvas]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  __draw(text, ctxOptions, canvas, ctx) // eslint-disable-line no-unused-vars
  {}

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number | {tl:number, tr:number, br:number, bl:number}} radius
   * @param {boolean} fill
   * @param {boolean} stroke
   */
  roundRect(ctx, x, y, width, height, radius, fill, stroke)
  {
    if (typeof stroke === 'undefined')
    {
      stroke = true;
    }
    if (typeof radius === 'undefined')
    {
      radius = 5;
    }
    if (typeof radius === 'number')
    {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    else
    {
      const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (const side in defaultRadius)
      {
        const _side = /** @type {keyof typeof defaultRadius} */ (side);
        radius[_side] = radius[_side] || defaultRadius[_side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill)
    {
      ctx.fill();
    }
    if (stroke)
    {
      ctx.stroke();
    }
  }
}

export { CanvasDrawer };
