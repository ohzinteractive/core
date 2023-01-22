import { AbstractLoader } from './AbstractLoader';

import { Texture } from 'three';

class AsyncTextureLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
  }

  on_preloaded_finished(resource_container)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      const texture = new Texture();
      const image = new Image();

      image.src = this.url;

      image.onload = () =>
      {
        texture.image = image;
        texture.needsUpdate = true;

        resource_container.set_resource(this.resource_id, this.url, texture);

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      };

      image.onerror = () =>
      {
        console.error('Error loading texture. Maybe the resource is not an image?', this.url, this.original_url);
      };
    }
    else
    {
      resource_container.set_resource(this.resource_id, this.url, resource_container.resources_by_url[this.url]);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    }
  }
}

export { AsyncTextureLoader };
