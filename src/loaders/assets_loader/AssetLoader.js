import { AbstractLoader } from '../../resource_loader/AbstractLoader';

export class AssetLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container, response)
  {
    response.blob().then((blob) =>
    {
      const url = URL.createObjectURL(blob);

      resource_container.set_resource(this.resource_id, this.url, url);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    });
  }
}
