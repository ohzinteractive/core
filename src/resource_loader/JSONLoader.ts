import { AbstractLoader } from './AbstractLoader';

class JSONLoader extends AbstractLoader
{
  resource_id: any;
  url: any;
  constructor(resource_id: any, url: any, size: any)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container: any)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      fetch(this.url).then((response) =>
      {
        response.json().then((json) =>
        {
          resource_container.set_resource(this.resource_id, this.url, json);

          this.__update_downloaded_bytes(1, 1);
          this.__loading_ended();
        });
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

export { JSONLoader };
