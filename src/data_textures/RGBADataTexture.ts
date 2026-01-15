import { RGBAFormat } from 'three';
import { CustomDataTexture } from './CustomDataTexture';

class RGBADataTexture extends CustomDataTexture
{
  constructor(width: number, height: number)
  {
    const data = new Uint8Array(width * height * 4);
    super(data, width, height, RGBAFormat);
    this.multiplier = 255;
  }
}

export { RGBADataTexture };
