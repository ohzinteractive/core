import { DataTexture } from 'three';

class CustomDataTexture extends DataTexture
{
  data: any;
  multiplier: number;
  
  constructor(data: any, width: number, height: number, format: any, type?: any)
  {
    super(data, width, height, format, type);
    this.multiplier = 1;
  }

  set_rgba(index: number, r: number, g: number, b: number, a: number)
  {
    this.data[index * 3 + 0] = r * this.multiplier;
    this.data[index * 3 + 1] = g * this.multiplier;
    this.data[index * 3 + 2] = b * this.multiplier;
    this.data[index * 3 + 3] = a * this.multiplier;
    this.needsUpdate = true;
  }

  set_rgb(index: number, r: number, g: number, b: number)
  {
    this.data[index * 3 + 0] = r * this.multiplier;
    this.data[index * 3 + 1] = g * this.multiplier;
    this.data[index * 3 + 2] = b * this.multiplier;
    this.needsUpdate = true;
  }

  set_r(index: number, value: number)
  {
    this.data[index * 3 + 0] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_g(index: number, value: number)
  {
    this.data[index * 3 + 1] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_b(index: number, value: number)
  {
    this.data[index * 3 + 2] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_a(index: number, value: number)
  {
    this.data[index * 3 + 2] = value * this.multiplier;
    this.needsUpdate = true;
  }
}

export { CustomDataTexture };
