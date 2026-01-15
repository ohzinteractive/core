import { AbstractLoader } from '../../resource_loader/AbstractLoader';
import type { ResourceContainer } from './ResourceContainer';

export class AssetLoader extends AbstractLoader
{
  constructor(resource_id: string, url: string, size: number)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container: ResourceContainer, response: Response)
  {
    response.blob().then((blob: Blob) => {
      const url = URL.createObjectURL(blob);

      resource_container.set_resource(this.resource_id, this.url, url);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    });
  }
}
