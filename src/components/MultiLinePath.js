import { Line } from '../Line';

import { Object3D } from 'three';

class MultiLinePath extends Object3D
{
  constructor(paths, webgl)
  {
    super();

    this.paths = [];
    for (let i = 0; i < paths.length; i++)
    {
      const line = new Line(paths[i], webgl);
      this.paths.push = line;
      this.add(line);
    }
  }
}

export { MultiLinePath };
