import { BaseShaderMaterial } from './BaseShaderMaterial';

import frag from '../shaders/sdf_text/sdf_text.frag';
import vert from '../shaders/sdf_text/sdf_text.vert';

import { DoubleSide, LinearFilter, Vector2 } from 'three';
import { OMath } from '../utilities/OMath';

class SDFTextMaterial extends BaseShaderMaterial
{
  constructor(texture: any)
  {
    super(vert, frag, {
      _Texture: { value: texture },
      _Boldness: { value: 0.5 },
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

  set_boldness(value: any)
  {
    this.uniforms._Boldness.value = OMath.lerp(0.5, 0.2, value);
  }
}

export { SDFTextMaterial };
