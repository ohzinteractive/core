import { AbstractLoader } from './AbstractLoader';

class JSONLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container)
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
