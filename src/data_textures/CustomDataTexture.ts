import { DataTexture } from 'three';

class CustomDataTexture extends DataTexture
{
  data: any;
  multiplier: any;
  constructor(data: any, width: any, height: any, format: any, type?: any)
  {
    super(data, width, height, format, type);
    this.multiplier = 1;
  }

  set_rgba(index: any, r: any, g: any, b: any, a: any)
  {
    this.data[index * 3 + 0] = r * this.multiplier;
    this.data[index * 3 + 1] = g * this.multiplier;
    this.data[index * 3 + 2] = b * this.multiplier;
    this.data[index * 3 + 3] = a * this.multiplier;
    this.needsUpdate = true;
  }

  set_rgb(index: any, r: any, g: any, b: any)
  {
    this.data[index * 3 + 0] = r * this.multiplier;
    this.data[index * 3 + 1] = g * this.multiplier;
    this.data[index * 3 + 2] = b * this.multiplier;
    this.needsUpdate = true;
  }

  set_r(index: any, value: any)
  {
    this.data[index * 3 + 0] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_g(index: any, value: any)
  {
    this.data[index * 3 + 1] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_b(index: any, value: any)
  {
    this.data[index * 3 + 2] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_a(index: any, value: any)
  {
    this.data[index * 3 + 2] = value * this.multiplier;
    this.needsUpdate = true;
  }
}

export { CustomDataTexture };
