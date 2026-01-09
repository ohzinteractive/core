import { CustomDataTexture } from './CustomDataTexture';
import { FloatType } from 'three';
import { RGBAFormat } from 'three';

class RGBAFloatDataTexture extends CustomDataTexture
{
  constructor(width: any, height: any)
  {
    const data = new Float32Array(width * height * 4);
    super(data, width, height, RGBAFormat, FloatType);
  }
}

export { RGBAFloatDataTexture };
