// @ts-check
import { Line } from './Line';

import { Object3D, Vector3 } from 'three'; // eslint-disable-line no-unused-vars

class MultiLinePath extends Object3D
{
  /**
   * @param {Array<Vector3[]>} paths
   */
  constructor(paths)
  {
    super();

    this.paths = [];
    for (let i = 0; i < paths.length; i++)
    {
      const line = new Line(paths[i]);
      this.paths.push(line);
      this.add(line);
    }
  }
}

export { MultiLinePath };
