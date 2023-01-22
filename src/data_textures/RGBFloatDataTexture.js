import { CustomDataTexture } from './CustomDataTexture';
import { FloatType } from 'three';
import { RGBFormat } from 'three';

class RGBFloatDataTexture extends CustomDataTexture
{
  constructor(width, height)
  {
    const data = new Float32Array(width * height * 3);
    super(data, width, height, RGBFormat, FloatType);
  }
}

export { RGBFloatDataTexture };
