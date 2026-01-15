import { Line } from './Line';

import type { Vector3 } from 'three';
import { Object3D } from 'three';

class MultiLinePath extends Object3D
{
  paths: Line[];

  constructor(paths: Array<Vector3>)
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
