import BlitMaterial from '/materials/BlitMaterial';
import frag from '/shaders/clear/clear_depth_normal_frag';
import * as THREE from 'three';

export default class ClearDepthNormalMaterial extends BlitMaterial
{
  constructor(clear_depth, clear_normal)
  {
    super(frag);
    this.uniforms._DepthNormal = { value: new THREE.Vector4(clear_depth, clear_normal.x, clear_normal.y, clear_normal.z) };
  }
}
