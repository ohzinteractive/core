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
    if (!resource_container.resources_by_url[this.url])
    {
      this.loader.load(this.url, (file) =>
      {
        resource_container.set_resource(this.resource_id, this.url, file);

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
}
