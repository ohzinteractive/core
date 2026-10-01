import { SRGBColorSpace } from 'three';
import { colorSpaceToWorking, directionToColor, normalWorldGeometry, vec4 } from 'three/tsl';
import { NodeMaterial } from 'three/webgpu';

// Colors each surface with its world space normal packed as normal * 0.5 + 0.5.
class NormalMaterial extends NodeMaterial
{
  constructor()
  {
    super();

    this.colorNode = vec4(colorSpaceToWorking(vec4(directionToColor(normalWorldGeometry), 1), SRGBColorSpace));
  }
}

export { NormalMaterial };
