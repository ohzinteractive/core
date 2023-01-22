import { CustomDataTexture } from './CustomDataTexture';
import { RGBAFormat } from 'three';

class RGBADataTexture extends CustomDataTexture
{
  constructor(width, height)
  {
    const data = new Uint8Array(width * height * 4);
    super(data, width, height, RGBAFormat);
    this.multiplier = 255;
  }
}

export { RGBADataTexture };
