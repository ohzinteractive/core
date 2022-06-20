import AbstractLoader from './AbstractLoader';

export default class VideoLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container, response)
  {
    if (!resource_container.resources_by_url[this.url])
    {
      response.blob().then((blob) =>
      {
        resource_container.set_resource(this.resource_id, this.url, URL.createObjectURL(blob));

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      });
    }
    else
    {
      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    }
  }
}
