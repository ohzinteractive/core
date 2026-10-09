import { SRGBColorSpace } from 'three';
import { colorSpaceToWorking, normalWorldGeometry, packNormalToRGB, vec4 } from 'three/tsl';
import { NodeMaterial } from 'three/webgpu';

// Colors each surface with its world space normal packed as normal * 0.5 + 0.5.
class NormalMaterial extends NodeMaterial
{
  constructor()
  {
    super();

    this.colorNode = vec4(colorSpaceToWorking(vec4(packNormalToRGB(normalWorldGeometry), 1), SRGBColorSpace));
  }
}

export { NormalMaterial };
