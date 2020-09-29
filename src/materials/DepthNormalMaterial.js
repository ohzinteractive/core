import vert from '../shaders/depth_normals/depth_normals.vert';
import frag from '../shaders/depth_normals/depth_normals.frag';

import { ShaderMaterial } from 'three';

export default class DepthNormalMaterial extends ShaderMaterial
{
  constructor()
  {
    super({
      uniforms: {
        _FarPlane: { value: 1 }
      },
      vertexShader: vert,
      fragmentShader: frag
    });
  }

  set far_plane(value)
  {
    this.uniforms._FarPlane.value = value;
  }
}
