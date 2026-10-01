import { BlitNodeMaterial } from '../materials/BlitNodeMaterial';
import { encode_float_rg, encode_normal } from './deferred/depth_normal_encoding';

import type { Vector3 } from 'three';
import { Vector4 } from 'three';
import { normalize, uniform, vec4 } from 'three/tsl';

// Fills a depth and normals target with one depth (x) and view space normal (yzw).
class ClearDepthNormalMaterial extends BlitNodeMaterial
{
  constructor(clear_depth: number, clear_normal: Vector3)
  {
    super();

    const depth_normal = uniform(new Vector4(clear_depth, clear_normal.x, clear_normal.y, clear_normal.z));

    this.uniforms._DepthNormal = depth_normal;

    this.fragmentNode = vec4(encode_float_rg(depth_normal.x), encode_normal(normalize(depth_normal.yzw)));
  }
}

export { ClearDepthNormalMaterial };
