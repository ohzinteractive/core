import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';

import { DDSLoader as TDDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';

class DDSLoader extends AbstractLoader
{
  loader: TDDSLoader;

  constructor(resource_id: string, url: string, size: number)
  {
    super(resource_id, url, size);
    this.loader = new TDDSLoader();
  }

  on_preloaded_finished(resource_container: ResourceContainer)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.loader.load(this.url, (dds: any) => {
        resource_container.set_resource(this.resource_id, this.url, dds);

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
      (msg: any) => {
        this.__set_error(msg + '\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource');
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
}

export { DDSLoader };
