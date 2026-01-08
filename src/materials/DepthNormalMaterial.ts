import vert from '../shaders/depth_normals/depth_normals.vert';
import frag from '../shaders/depth_normals/depth_normals.frag';

import { ShaderMaterial } from 'three';

class DepthNormalMaterial extends ShaderMaterial
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

  get far_plane()
  {
    return this.uniforms._FarPlane.value;
  }
}

export { DepthNormalMaterial };
