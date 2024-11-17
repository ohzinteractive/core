import { Browser } from '../Browser';
import { AbstractLoader } from './AbstractLoader';

import { NoColorSpace, SRGBColorSpace, Texture } from 'three';

export class AsyncTextureLoader extends AbstractLoader
{
  constructor(resource_id, url, size, flipY = true, premultiplyAlpha = false, colorSpaceConversion = true)
  {
    super(resource_id, url, size);

    this.original_url = '';

    this.colorSpaceConversion = colorSpaceConversion;
    this.premultiplyAlpha = premultiplyAlpha;
    this.flipY = flipY;
  }

  on_preloaded_finished(resource_container)
  {
    if (Browser.is_safari) // && Browser.version < 15
    {
      this.load_with_old_method(resource_container);
    }
    else
    {
      this.load_with_new_method(resource_container);
    }
  }

  load_with_old_method(resource_container)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      const texture = new Texture();
      const image = new Image();

      image.src = this.url;

      image.onload = () =>
      {
        texture.image = image;
        texture.flipY = this.flipY;
        texture.premultiplyAlpha = this.premultiplyAlpha;
        texture.colorSpace = this.colorSpaceConversion ? SRGBColorSpace : NoColorSpace;
        texture.needsUpdate = true;

        resource_container.set_resource(this.resource_id, this.url, texture);

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      };

      image.onerror = () =>
      {
        console.error('The source image could not be decoded.', this.original_url);
      };
    }
    else
    {
      resource_container.set_resource(this.resource_id, this.url, resource_container.resources_by_url[this.url]);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    }
  }

  load_with_new_method(resource_container)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      const fetchOptions = {};
      fetchOptions.credentials = 'same-origin';
      // fetchOptions.headers = this.requestHeader;

      fetch(this.url, fetchOptions).then((res) =>
      {
        return res.blob();
      }).then((blob) =>
      {
        return createImageBitmap(blob, {
          colorSpaceConversion: this.colorSpaceConversion ? 'default' : 'none',
          imageOrientation: this.flipY ? 'flipY' : 'from-image',
          premultiplyAlpha: this.premultiplyAlpha ? 'premultiply' : 'none'
        });
      }).then((imageBitmap) =>
      {
        const texture = new Texture(imageBitmap);
        texture.flipY = this.flipY;
        texture.premultiplyAlpha = this.premultiplyAlpha;
        texture.colorSpace = this.colorSpaceConversion ? SRGBColorSpace : NoColorSpace;
        texture.needsUpdate = true;

        resource_container.set_resource(this.resource_id, this.url, texture);

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      }).catch((e) =>
      {
        console.error(e, this.original_url);
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
