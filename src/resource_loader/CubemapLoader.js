import AbstractLoader from './AbstractLoader';

import { CubeTextureLoader as THREECubeTextureLoader } from 'three';

export default class CubemapLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREECubeTextureLoader();
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
    let ctx = this;

    this.loader.load(this.urls, (image) =>
    {
      resource_container.set_resource(ctx.resource_id, image);

      ctx.__update_downloaded_bytes(1, 1);
      ctx.__loading_ended();
    },
    (xhr) =>
    {
      // if (xhr)
      // {
      //   let total = xhr.total || this.size;
      //   ctx.__update_downloaded_bytes(xhr.loaded, total);
      // }
    },
    (error) =>
    {
      ctx.__set_error('Image could not  be loaded. Maybe wrong name or path, I don\'t know' + '¯\\_(ツ)_/¯', error);
      ctx.__loading_ended();
    }
    );
  }
}
