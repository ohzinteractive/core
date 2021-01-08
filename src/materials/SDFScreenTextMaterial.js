import BaseShaderMaterial from './BaseShaderMaterial';
import frag from '../shaders/sdf_text/sdf_screen_text.frag';
import vert from '../shaders/sdf_text/sdf_screen_text.vert';

import { Vector2, DoubleSide, LinearFilter } from 'three';

export default class SDFScreenTextMaterial extends BaseShaderMaterial
{
  constructor(texture)
  {
    super(vert, frag, {
      _Texture: { value: texture },
      _AtlasSize: { value: new Vector2(1, 1) }
    });

    this.transparent = true;
    this.extensions = {
      derivatives: true
    };
    this.depthWrite = false;
    this.side = DoubleSide;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipMaps = false;
  }

  set_atlas_size(size)
  {
    this.uniforms._AtlasSize.value.copy(size);
  }
}
