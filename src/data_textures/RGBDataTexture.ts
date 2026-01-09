import { RGBAFormat } from 'three';
import { CustomDataTexture } from './CustomDataTexture';

class RGBDataTexture extends CustomDataTexture
{
  constructor(width: any, height: any)
  {
    const data = new Uint8Array(width * height * 3);
    super(data, width, height, RGBAFormat);
    this.multiplier = 255;
  }
}

export { RGBDataTexture };
