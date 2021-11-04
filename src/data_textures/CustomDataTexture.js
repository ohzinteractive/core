import { DataTexture } from 'three';

export default class CustomDataTexture extends DataTexture
{
  constructor(data, width, height, format, type)
  {
    super(data, width, height, format, type);
    this.multiplier = 1;
  }

  set_rgba(index, r, g, b, a)
  {
    this.data[index * 3 + 0] = r * this.multiplier;
    this.data[index * 3 + 1] = g * this.multiplier;
    this.data[index * 3 + 2] = b * this.multiplier;
    this.data[index * 3 + 3] = a * this.multiplier;
    this.needsUpdate = true;
  }

  set_rgb(index, r, g, b)
  {
    this.data[index * 3 + 0] = r * this.multiplier;
    this.data[index * 3 + 1] = g * this.multiplier;
    this.data[index * 3 + 2] = b * this.multiplier;
    this.needsUpdate = true;
  }

  set_r(index, value)
  {
    this.data[index * 3 + 0] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_g(index, value)
  {
    this.data[index * 3 + 1] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_b(index, value)
  {
    this.data[index * 3 + 2] = value * this.multiplier;
    this.needsUpdate = true;
  }

  set_a(index, value)
  {
    this.data[index * 3 + 2] = value * this.multiplier;
    this.needsUpdate = true;
  }
}
