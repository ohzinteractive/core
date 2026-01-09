import { AbstractLoader } from './AbstractLoader';

// import { sRGBEncoding } from 'three';

class BasisLoader extends AbstractLoader
{
  loader: any;
  resource_id: any;
  url: any;
  constructor(resource_id: any, url: any, loader: any, size: any)
  {
    super(resource_id, url, size);

    this.loader = loader;
  }

  on_preloaded_finished(resource_container: any)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.loader.load(this.url, (basis: any) => {
      // basis.encoding = sRGBEncoding;

        resource_container.set_resource(this.resource_id, this.url, basis);

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      },
      (xhr: any) => {
      // if (xhr)
      // {
      //   let total = xhr.total || this.total_bytes;
      //   this.__update_downloaded_bytes(xhr.loaded, total);
      // }
      },
      (msg: any) => {
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

export { BasisLoader };
