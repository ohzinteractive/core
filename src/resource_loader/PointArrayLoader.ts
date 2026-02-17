import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';

import { FileLoader, Vector3 } from 'three';

class PointArrayLoader extends AbstractLoader
{
  loader: FileLoader;
  resource_id: string;
  url: string;
  
  constructor(resource_id: string, url: string, size: number)
  {
    super(resource_id, url, size);
    this.loader = new FileLoader();
  }

  on_preloaded_finished(resource_container: ResourceContainer)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.loader.load(this.url, (text: string) => {
        resource_container.set_resource(this.resource_id, this.url, this.parse_path(text));

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      },
      () => {
      // if (xhr)
      // {
      //   let total = xhr.total || this.total_bytes;
      //   this.__update_downloaded_bytes(xhr.loaded, total);
      // }
      },
      (msg: string) => {
        this.__set_error(msg);
        this.__loading_ended();
      });
    }
    else
    {
      resource_container.set_resource(this.resource_id, this.url, resource_container.resources_by_url[this.url]);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    }
  }

  parse_path(raw_data: string)
  {
    const string_array = raw_data.split('\n');

    if (string_array[string_array.length - 1] === '')
    {
      string_array.pop();
    }

    const positions: Vector3[] = [];

    for (let i = 0; i < string_array.length; i += 3)
    {
      const x = parseFloat(string_array[i + 0]);
      const y = parseFloat(string_array[i + 1]);
      const z = parseFloat(string_array[i + 2]);
      positions.push(new Vector3(x, y, z));
    }
    return positions;
    // let curve = new THREE.CatmullRomCurve3(positions);
    // return curve.getPoints(100);
  }
}

export { PointArrayLoader };
