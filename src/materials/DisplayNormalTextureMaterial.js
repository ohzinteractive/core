import BlitMaterial from '../materials/BlitMaterial';
import frag from '../shaders/depth_normals/debug_normals.frag';
import depth_normals_vert from '../shaders/ssao/ssao.vert';

import { Matrix4 } from 'three';

export default class DisplayNormalTextureMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag, depth_normals_vert);
    this.uniforms._FarPlane          = { value: 1 };
    this.uniforms._InverseProjMatrix = { value: new Matrix4() };
  }
}
