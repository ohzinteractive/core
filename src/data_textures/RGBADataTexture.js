import CustomDataTexture from './CustomDataTexture';
import { RGBAFormat } from 'three';

export default class RGBADataTexture extends CustomDataTexture
{
  constructor(width, height)
  {
    let data = new Uint8Array(width * height * 4);
    super(data, width, height, RGBAFormat);
    this.multiplier = 255;
  }
}
