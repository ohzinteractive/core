import { Text2D } from './Text2D';

import { Object3D, Vector2 } from 'three';

class MultiLineText2D extends Object3D
{
  text_array: any;
  /**
   * @param {string[]} text_array
   * @param {string} [font]
   * @param {string | number} [color]
   * @param {Vector2} [pivot]
   * @param {boolean} [is_static]
   */
  constructor(text_array: any, font: any, color: any, pivot: any, is_static: any) 
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

  /**
   * @returns {string[]}
   */
  get texts(): any
  {
    return [];
  }

  get size()
  {
    return 1;
  }
}

export { MultiLineText2D };
