import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';

class VideoLoader extends AbstractLoader
{
  resource_id: string;
  url: string;
  
  constructor(resource_id: string, url: string, size: number)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container: ResourceContainer, response: Response)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      response.blob().then((blob: Blob) => {
        resource_container.set_resource(this.resource_id, this.url, URL.createObjectURL(blob));

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

export { VideoLoader };
