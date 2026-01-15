import frag from '../shaders/depth_normals/depth_normals.frag';
import vert from '../shaders/depth_normals/depth_normals.vert';

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
  
  set far_plane(value: number)
  {
    this.uniforms._FarPlane.value = value;
  }
  
  get far_plane(): number
  {
    return this.uniforms._FarPlane.value as number;
  }
}

export { DepthNormalMaterial };
