import { AbstractLoader } from './AbstractLoader';

import { CubeTextureLoader } from 'three';

class CubemapLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new CubeTextureLoader();
    this.loader.setPath(url + '/');
    this.urls = [
      'px.png',
      'nx.png',
      'py.png',
      'ny.png',
      'pz.png',
      'nz.png'
    ];
  }

  on_preloaded_finished(resource_container)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.loader.load(this.urls, (image) =>
      {
        resource_container.set_resource(this.resource_id, this.url, image);

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
      (error) =>
      {
        this.__set_error('Image could not  be loaded. Maybe wrong name or path, I don\'t know' + '¯\\_(ツ)_/¯', error);
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
