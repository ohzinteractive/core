import AbstractLoader from './AbstractLoader';

import { FileLoader as THREEFileLoader } from 'three';

export default class FileLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREEFileLoader();
  }

  on_preloaded_finished(resource_container)
  {
    let ctx = this;

    this.loader.load(this.url, (gltf) =>
    {
      resource_container.set_resource(ctx.resource_id, ctx.url, gltf);

      ctx.__update_downloaded_bytes(1, 1);
      ctx.__loading_ended();
    },
    (xhr) =>
    {
      // if (xhr)
      // {
      //   let total = xhr.total || this.total_bytes;
      //   ctx.__update_downloaded_bytes(xhr.loaded, total);
      // }
    },
    (msg) =>
    {
      ctx.__set_error(msg);
      ctx.__loading_ended();
    }
    );
  }
}
