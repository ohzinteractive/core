import AbstractLoader from './AbstractLoader';

import * as THREEOBJLoader from 'three/examples/jsm/loaders/OBJLoader.js';

export default class OBJLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREEOBJLoader.OBJLoader();
  }

  on_preloaded_finished(resource_container)
  {
    if (!resource_container.resources_by_url[this.url])
    {
      this.loader.load(this.url, (obj) =>
      {
        resource_container.set_resource(this.resource_id, this.url, obj);

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
        this.__set_error(msg + '\n\n\t If the error says something about unexpected token < in JSON then probably the problem is related to the file not being found. Check the name and path of the resource');
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
