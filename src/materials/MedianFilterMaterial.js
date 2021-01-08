import BlitMaterial from '../materials/BlitMaterial';
import frag from '../shaders/median_filter/median_filter.frag';

import { Vector2 } from 'three';

export default class MedianFilterMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag, undefined, {
      kernel3x3: true
    });

    this.uniforms._SourceTex = { value: undefined };
    this.uniforms._SourceTexSize = { value: new Vector2(1, 1) };
  }

  set_texture(tex)
  {
    this.uniforms._SourceTex.value = tex;

    let size = this.get_size(tex);
    this.uniforms._SourceTexSize.value.copy(size);
  }

  get_size(tex)
  {
    if (tex.isVideoTexture)
    {
      return new Vector2(Math.max(1, tex.image.videoWidth), Math.max(1, tex.image.videoHeight));
    }
    if (tex.isWebGLRenderTarget)
    {
      return new Vector2(tex.width, tex.height);
    }
    if (tex.isTexture)
    {
      return new Vector2(tex.image.width, tex.image.height);
    }
    return new Vector2(1, 1);
  }
}
