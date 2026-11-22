import { Browser } from '../Browser';
import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';

import { NoColorSpace, SRGBColorSpace, Texture } from 'three';

export class AsyncTextureLoader extends AbstractLoader
{
  original_url: string;
  colorSpaceConversion: boolean;
  premultiplyAlpha: boolean;
  flipY: boolean;

  constructor(resource_id: string, url: string, size: number, flipY = true, premultiplyAlpha = false, colorSpaceConversion = true)
  {
    super(resource_id, url, size);

    this.original_url = '';
    this.colorSpaceConversion = colorSpaceConversion;
    this.premultiplyAlpha = premultiplyAlpha;
    this.flipY = flipY;
  }

  // Safari before 17 mishandles createImageBitmap options, so it decodes through an
  // HTMLImageElement (three.js' GLTFLoader uses the same threshold). Safari 17+ must
  // take the ImageBitmap path: its WebGPU copyExternalImageToTexture silently uploads
  // garbage for HTMLImageElement sources. Safari before 17 has no WebGPU, so there the
  // renderer always runs the WebGL2 backend, which uploads HTMLImageElements fine.
  static uses_image_element(browser: { is_safari: boolean, version: number }, has_image_bitmap = typeof createImageBitmap === 'function'): boolean
  {
    if (!has_image_bitmap)
    {
      return true;
    }

    // An unreadable Safari version (NaN) also falls back to the safe path.
    return browser.is_safari && !(browser.version >= 17);
  }

  on_preloaded_finished(resource_container: ResourceContainer)
  {
    if (AsyncTextureLoader.uses_image_element(Browser))
    {
      this.load_with_old_method(resource_container);
    }
    else
    {
      this.load_with_new_method(resource_container);
    }
  }

  load_with_old_method(resource_container: ResourceContainer)
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

  load_with_new_method(resource_container: ResourceContainer)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      const fetchOptions: RequestInit = {};
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
        // imageOrientation: 'flipY' already flipped the pixels. WebGPURenderer honors
        // flipY for ImageBitmaps too, so consumers check this flag to avoid a second flip.
        texture.userData.pre_flipped = this.flipY;
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
