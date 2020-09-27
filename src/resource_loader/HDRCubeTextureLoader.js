import AbstractLoader from '/resource_loader/AbstractLoader';

import * as THREEHDRCubeTextureLoader from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { UnsignedByteType } from 'three';

export default class HDRCubeTextureLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREEHDRCubeTextureLoader.HDRCubeTextureLoader();
    this.url_suffix = ['/px.hdr', '/nx.hdr', '/py.hdr', '/ny.hdr', '/pz.hdr', '/nz.hdr'];
  }

  load(resource_container)
  {
    let ctx = this;

    this.loader.setPath(this.url)
      .setDataType(UnsignedByteType)
      .load(this.url_suffix, (hdr) =>
      {
        resource_container.set_resource(ctx.resource_id, hdr);
        ctx.__update_progress(1);
        ctx.__loading_ended();
      },
      (xhr) =>
      {
        if (xhr)
        {
          let total = xhr.total || this.size;
          ctx.__update_progress(xhr.loaded / total);
        }
      },
      (msg) =>
      {
        ctx.__set_error(msg + '\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource');
        ctx.__loading_ended();
      }
      );
  }
}
