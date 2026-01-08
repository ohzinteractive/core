import { AbstractLoader } from './AbstractLoader';

import { HDRCubeTextureLoader as THDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';

class HDRCubeTextureLoader extends AbstractLoader
{
  constructor(resource_id, url, extension, size)
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

  on_preloaded_finished(resource_container)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.loader.load(this.urls, (hdr) =>
      {
        resource_container.set_resource(this.resource_id, this.url, hdr);

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
