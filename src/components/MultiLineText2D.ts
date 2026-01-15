import { Text2D } from './Text2D';

import { Object3D, Vector2 } from 'three';

class MultiLineText2D extends Object3D
{
  text_array: Text2D[];

  constructor(text_array: string[], font?: string, color?: string | number, pivot?: Vector2, is_static?: boolean) 
  {
    super();

    font = font || '200px Arial';
    color = color || '#000000';
    pivot = pivot || new Vector2();

    this.text_array = [];

    for (let i = 0; i < text_array.length; i++)
    {
      const text2D = new Text2D(text_array[i], font, color, pivot);
      this.text_array.push(text2D);
      this.add(text2D);
    }

    this.update_text_positions();
  }

  update_text_positions()
  {
    for (let i = 0; i < this.text_array.length; i++)
    {
      this.text_array[i].position.y = -this.text_array[i].size.y * i;
    }
  }

  set texts(text_array)
  {
    for (let i = 0; i < this.text_array.length; i++)
    {
      this.text_array[i].text = text_array[i];
    }
  }

  set size(value)
  {
    for (let i = 0; i < this.text_array.length; i++)
    {
      this.text_array[i].size.set(value, value, value);
    }
    this.update_text_positions();
  }

  get texts(): string[]
  {
    return [];
  }

  get size()
  {
    return 1;
  }
}

export { MultiLineText2D };
