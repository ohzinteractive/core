import AbstractLoader from './AbstractLoader';

export default class JSONLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container, response)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      response.json().then((json) =>
      {
        resource_container.set_resource(this.resource_id, this.url, json);

        this.__update_downloaded_bytes(1, 1);
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
