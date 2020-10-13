import AbstractLoader from './AbstractLoader';

import { TextureLoader as THREETextureLoader } from 'three';

export default class TextureLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREETextureLoader();
  }

  load(resource_container)
  {
    let ctx = this;

    this.loader.load(this.url, (image) =>
    {
      resource_container.set_resource(ctx.resource_id, image);
      ctx.__update_progress(1);
      ctx.__loading_ended();
    },
    (xhr) =>
    {
      if (xhr)
      {
        let total = xhr.total || this.size;
        ctx.__update_progress(xhr.loaded / total);
      }
    },
    () =>
    {
      ctx.__set_error('Image could not  be loaded. Maybe wrong name or path, I don\'t know' + '¯\\_(ツ)_/¯');
      ctx.__loading_ended();
    }
    );
  }
}
