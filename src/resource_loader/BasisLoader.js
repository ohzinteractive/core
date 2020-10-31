import AbstractLoader from './AbstractLoader';

import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';
import { sRGBEncoding } from 'three';
import { WebGLRenderer } from 'three';

export default class DAELoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new BasisTextureLoader();

    this.loader.setTranscoderPath(
      'libs/basis/'
    );

    this.canvas = document.createElement('canvas');
    this.canvas.getContext('webgl');

    this.renderer = new WebGLRenderer({
      canvas: this.canvas
    });

    this.loader.detectSupport(this.renderer);
  }

  load(resource_container)
  {
    let ctx = this;

    this.loader.load(this.url, (basis) =>
    {
      basis.encoding = sRGBEncoding;

      resource_container.set_resource(ctx.resource_id, basis);
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
