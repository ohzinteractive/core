import { FloatType, RGBAFormat } from 'three';
import { CustomDataTexture } from './CustomDataTexture';

class RGBFloatDataTexture extends CustomDataTexture
{
  constructor(width: any, height: any)
  {
    const data = new Float32Array(width * height * 3);
    super(data, width, height, RGBAFormat, FloatType);
  }
}

export { RGBFloatDataTexture };
