import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';

import { CubeTextureLoader } from 'three';

class CubemapLoader extends AbstractLoader
{
  loader: CubeTextureLoader;
  urls: string[];

  constructor(resource_id: string, url: string, extension: string, size: number)
  {
    super(resource_id, url, size);
    this.loader = new CubeTextureLoader();
    this.loader.setPath(url + '/');

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
      this.loader.load(this.urls, (image: any) => {
        resource_container.set_resource(this.resource_id, this.url, image);

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
      (error: any) => {
        this.__set_error('Image could not  be loaded. Maybe wrong name or path, I don\'t know' + '¯\\_(ツ)_/¯' + error);
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

export { CubemapLoader };
