import { AbstractLoader } from './AbstractLoader';

import { FileLoader as TFileLoader } from 'three';

class TextLoader extends AbstractLoader
{
  loader: TFileLoader;

  constructor(resource_id: any, url: any, size: any)
  {
    super(resource_id, url, size);
    this.loader = new TFileLoader();
  }

  on_preloaded_finished(resource_container: any)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.loader.load(this.url, (gltf: any) => {
        resource_container.set_resource(this.resource_id, this.url, gltf);

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      },
      (xhr: any) => {
      // if (xhr)
      // {
      //   let total = xhr.total || this.total_bytes;
      //   this.__update_downloaded_bytes(xhr.loaded, total);
      // }
      },
      (msg: any) => {
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
}

export { TextLoader };
