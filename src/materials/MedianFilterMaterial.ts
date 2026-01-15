import { BlitMaterial } from '../materials/BlitMaterial';

import frag from '../shaders/median_filter/median_filter.frag';

import type { Texture, VideoTexture, WebGLRenderTarget } from 'three';
import { Vector2 } from 'three';

class MedianFilterMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag, undefined, {
      kernel3x3: true
    });

    this.uniforms._SourceTex = { value: undefined };
    this.uniforms._SourceTexSize = { value: new Vector2(1, 1) };
  }

  set_texture(tex: Texture)
  {
    this.uniforms._SourceTex.value = tex;

    const size = this.get_size(tex);
    (this.uniforms._SourceTexSize.value as Vector2).copy(size);
  }

  get_size(tex: Texture)
  {
    if ((tex as VideoTexture).isVideoTexture)
    {
      return new Vector2(Math.max(1, (tex.image as HTMLVideoElement).videoWidth), Math.max(1, (tex.image as HTMLVideoElement).videoHeight));
    }
    if ((tex as unknown as WebGLRenderTarget).isWebGLRenderTarget)
    {
      return new Vector2(tex.width, tex.height);
    }
    if (tex.isTexture)
    {
      return new Vector2((tex.image as ImageBitmap).width, (tex.image as ImageBitmap).height);
    }
    return new Vector2(1, 1);
  }
}

export { MedianFilterMaterial };
