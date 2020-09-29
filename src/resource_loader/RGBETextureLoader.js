import AbstractLoader from './AbstractLoader';

import * as THREERGBELoader from 'three/examples/jsm/loaders/RGBELoader.js';

import { UnsignedByteType as THREEUnsignedByteType } from 'three';

export default class RGBETextureLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREERGBELoader.RGBELoader();
    this.loader.setDataType(THREEUnsignedByteType);
  }

  load(resource_container)
  {
    let ctx = this;

    this.loader.load(this.url, (hdr) =>
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
