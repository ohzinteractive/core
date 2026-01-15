import { BlitMaterial } from '../materials/BlitMaterial';

import frag from '../shaders/clear/clear_depth_normal.frag';

import type { Vector3 } from 'three';
import { Vector4 } from 'three';

class ClearDepthNormalMaterial extends BlitMaterial
{
  constructor(clear_depth: number, clear_normal: Vector3)
  {
    super(frag);
    this.uniforms._DepthNormal = { value: new Vector4(clear_depth, clear_normal.x, clear_normal.y, clear_normal.z) };
  }
}

export { ClearDepthNormalMaterial };
