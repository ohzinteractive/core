import { SRGBColorSpace } from 'three';
import { colorSpaceToWorking, normalWorldGeometry, packNormalToRGB, vec4 } from 'three/tsl';
import type { Node } from 'three/webgpu';
import { NodeMaterial } from 'three/webgpu';

// Colors each surface with its world space normal packed as normal * 0.5 + 0.5.
class NormalMaterial extends NodeMaterial
{
  constructor()
  {
    super();

    // ColorSpaceNode is typed Node<unknown>, but it outputs the vec4 it was given.
    this.colorNode = vec4(colorSpaceToWorking(vec4(packNormalToRGB(normalWorldGeometry), 1), SRGBColorSpace) as unknown as Node<'vec4'>);
  }
}

export { NormalMaterial };
