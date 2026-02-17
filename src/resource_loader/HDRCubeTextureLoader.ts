import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';

import { HDRCubeTextureLoader as THDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';

class HDRCubeTextureLoader extends AbstractLoader
{
  loader: THDRCubeTextureLoader;
  urls: string[];

  constructor(resource_id: string, url: string, extension: string, size: number)
  {
    super(resource_id, url, size);
    this.loader = new THDRCubeTextureLoader();
    this.loader.setPath(url + '/');
    // this.loader.setDataType(UnsignedByteType);
    this.urls = [
      `px.${extension}`,
      `nx.${extension}`,
      `py.${extension}`,
      `ny.${extension}`,
      `pz.${extension}`,
      `nz.${extension}`
    ];
  }

  on_preloaded_finished(resource_container: ResourceContainer)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.loader.load(this.urls, (hdr: any) => {
        resource_container.set_resource(this.resource_id, this.url, hdr);

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

export { HDRCubeTextureLoader };
