import AbstractLoader from './AbstractLoader';

import { Vector3 as THREEVector3 } from 'three';
import { FileLoader as THREEFileLoader } from 'three';

export default class PointArrayLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREEFileLoader();
  }

  load(resource_container)
  {
    let ctx = this;

    this.loader.load(this.url, (text) =>
    {
      resource_container.set_resource(ctx.resource_id, ctx.parse_path(text));
      ctx.__update_progress(1);
      ctx.__loading_ended();
    },
    (xhr) =>
    {
      if (xhr)
      {
        let total = xhr.total || this.size;
        ctx.__update_progress(xhr.loaded / total);
      }
    },
    (msg) =>
    {
      ctx.__set_error(msg);
      ctx.__loading_ended();
    }
    );
  }

  parse_path(raw_data)
  {
    let string_array = raw_data.split('\n');

    if (string_array[string_array.length - 1] === '')
    {
      string_array.pop();
    }

    let positions = [];

    for (let i = 0; i < string_array.length; i += 3)
    {
      let x = parseFloat(string_array[i + 0]);
      let y = parseFloat(string_array[i + 1]);
      let z = parseFloat(string_array[i + 2]);
      positions.push(new THREEVector3(x, y, z));
    }
    return positions;
    // let curve = new THREE.CatmullRomCurve3(positions);
    // return curve.getPoints(100);
  }
}
