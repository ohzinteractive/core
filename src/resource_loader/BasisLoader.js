import AbstractLoader from './AbstractLoader';

// import { sRGBEncoding } from 'three';

export default class BasisLoader extends AbstractLoader
{
  constructor(resource_id, url, loader, size)
  {
    super(resource_id, url, size);

    this.loader = loader;
  }

  on_preloaded_finished(resource_container)
  {
    const ctx = this;

    this.loader.load(this.url, (basis) =>
    {
      // basis.encoding = sRGBEncoding;

      resource_container.set_resource(ctx.resource_id, ctx.url, basis);

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
      ctx.__set_error(msg + '\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource');
      ctx.__loading_ended();
    }
    );
  }
}
