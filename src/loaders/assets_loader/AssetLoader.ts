import { AbstractLoader } from '../../resource_loader/AbstractLoader';

export class AssetLoader extends AbstractLoader
{
  constructor(resource_id: any, url: any, size: any)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container: any, response: any)
  {
    response.blob().then((blob: any) => {
      const url = URL.createObjectURL(blob);

      resource_container.set_resource(this.resource_id, this.url, url);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    });
  }
}
