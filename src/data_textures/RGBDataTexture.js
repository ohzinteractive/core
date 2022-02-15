import CustomDataTexture from './CustomDataTexture';
import { RGBFormat } from 'three';

export default class RGBDataTexture extends CustomDataTexture
{
  constructor(width, height)
  {
    const data = new Uint8Array(width * height * 3);
    super(data, width, height, RGBFormat);
    this.multiplier = 255;
  }
}
