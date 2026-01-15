import { FloatType, RGBAFormat } from 'three';
import { CustomDataTexture } from './CustomDataTexture';

class RGBAFloatDataTexture extends CustomDataTexture
{
  constructor(width: number, height: number)
  {
    const data = new Float32Array(width * height * 4);
    super(data, width, height, RGBAFormat, FloatType);
  }
}

export { RGBAFloatDataTexture };
