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

  on_preloaded_finished(resource_container)
  {
    if (!resource_container.resources_by_url[this.url])
    {
      this.loader.load(this.url, (text) =>
      {
        resource_container.set_resource(this.resource_id, this.url, this.parse_path(text));

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      },
      (xhr) =>
      {
      // if (xhr)
      // {
      //   let total = xhr.total || this.total_bytes;
      //   this.__update_downloaded_bytes(xhr.loaded, total);
      // }
      },
      (msg) =>
      {
        this.__set_error(msg);
        this.__loading_ended();
      });
    }
    else
    {
      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    }
  }

  parse_path(raw_data)
  {
    const string_array = raw_data.split('\n');

    if (string_array[string_array.length - 1] === '')
    {
      string_array.pop();
    }

    const positions = [];

    for (let i = 0; i < string_array.length; i += 3)
    {
      const x = parseFloat(string_array[i + 0]);
      const y = parseFloat(string_array[i + 1]);
      const z = parseFloat(string_array[i + 2]);
      positions.push(new THREEVector3(x, y, z));
    }
    return positions;
    // let curve = new THREE.CatmullRomCurve3(positions);
    // return curve.getPoints(100);
  }
}
