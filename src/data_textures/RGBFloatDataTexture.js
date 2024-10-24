import { FloatType, RGBAFormat } from 'three';
import { CustomDataTexture } from './CustomDataTexture';

class RGBFloatDataTexture extends CustomDataTexture
{
  constructor(width, height)
  {
    const data = new Float32Array(width * height * 3);
    super(data, width, height, RGBAFormat, FloatType);
  }
}

export { RGBFloatDataTexture };
