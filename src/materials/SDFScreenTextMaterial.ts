import { BaseShaderMaterial } from './BaseShaderMaterial';

import frag from '../shaders/sdf_text/sdf_screen_text.frag';
import vert from '../shaders/sdf_text/sdf_screen_text.vert';

import { DoubleSide, LinearFilter, Vector2 } from 'three';

class SDFScreenTextMaterial extends BaseShaderMaterial
{
  constructor(texture: any)
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
    texture.generateMipMaps = false;
  }

  set_atlas_size(size: any)
  {
    this.uniforms._AtlasSize.value.copy(size);
  }
}

export { SDFScreenTextMaterial };
