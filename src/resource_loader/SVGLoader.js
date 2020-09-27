import AbstractLoader from '/resource_loader/AbstractLoader';

import * as THREESVGLoader from 'three/examples/jsm/loaders/SVGLoader.js';

export default class SVGLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREESVGLoader.SVGLoader();
  }

  load(resource_container)
  {
    let ctx = this;

    this.loader.load(this.url, (data) =>
    {
      resource_container.set_resource(ctx.resource_id, data);
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
