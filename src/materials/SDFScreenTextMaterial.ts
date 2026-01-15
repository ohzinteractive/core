import { BaseShaderMaterial } from './BaseShaderMaterial';

import frag from '../shaders/sdf_text/sdf_screen_text.frag';
import vert from '../shaders/sdf_text/sdf_screen_text.vert';

import type { Texture } from 'three';
import { DoubleSide, LinearFilter, Vector2 } from 'three';

class SDFScreenTextMaterial extends BaseShaderMaterial
{
  constructor(texture: Texture)
  {
    super(vert, frag, {
      _Texture: { value: texture },
      _AtlasSize: { value: new Vector2(1, 1) }
    });

    this.transparent = true;
    this.depthWrite = false;
    this.side = DoubleSide;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;
  }

  set_atlas_size(size: Vector2)
  {
    (this.uniforms._AtlasSize.value as Vector2).copy(size);
  }
}

export { SDFScreenTextMaterial };
