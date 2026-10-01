import type { Texture } from 'three';
import { Vector2 } from 'three';
import { uniform, uv, vec4 } from 'three/tsl';
import { BlitNodeMaterial } from './BlitNodeMaterial';

// Draws _MainTex on a screen space rectangle, _TextureSize pixels wide and tall, whose
// bottom left corner sits _ScreenSpacePosition pixels from the bottom left corner of a
// _ScreenSize pixels screen. The texture is sampled through BlitNodeMaterial, so render
// targets and regular textures both show upright on every backend.
class ScreenSpaceTextureMaterial extends BlitNodeMaterial
{
  constructor()
  {
    super();

    const screen_space_position = uniform(new Vector2());
    const screen_size = uniform(new Vector2());
    const texture_size = uniform(new Vector2());

    this.uniforms._ScreenSpacePosition = screen_space_position;
    this.uniforms._ScreenSize = screen_size;
    this.uniforms._TextureSize = texture_size;

    // Drawn on a 1x1 PlaneGeometry, whose UV is the bottom left based point of the rectangle.
    const screen_uv = uv().mul(texture_size).add(screen_space_position).div(screen_size);

    this.vertexNode = vec4(screen_uv.mul(2).sub(1), 0, 1);
  }

  set_position(x: number, y: number)
  {
    (this.uniforms._ScreenSpacePosition.value as Vector2).set(x, y);
  }

  set_texture(tex: Texture, w: number, h: number)
  {
    this.uniforms._MainTex.value = tex;
    (this.uniforms._TextureSize.value as Vector2).set((tex.image as ImageBitmap).width, (tex.image as ImageBitmap).height);

    if (w !== undefined)
    {
      (this.uniforms._TextureSize.value as Vector2).x = w;
    }
    if (h !== undefined)
    {
      (this.uniforms._TextureSize.value as Vector2).y = h;
    }
  }

  set_screen_size(w: number, h: number)
  {
    (this.uniforms._ScreenSize.value as Vector2).set(w, h);
  }
}

export { ScreenSpaceTextureMaterial };
