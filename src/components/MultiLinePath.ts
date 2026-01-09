
import { Line } from './Line';

import { Object3D, Vector3 } from 'three';

class MultiLinePath extends Object3D
{
  paths: any;
  /**
   * @param {Array<Vector3[]>} paths
   */
  constructor(paths: any)
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
