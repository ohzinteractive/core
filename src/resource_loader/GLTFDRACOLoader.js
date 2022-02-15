import AbstractLoader from './AbstractLoader';

import * as THREEGLTFLoader from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREEDRACOLoader from 'three/examples/jsm/loaders/DRACOLoader.js';

export default class GLTFDRACOLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREEGLTFLoader.GLTFLoader();
    this.draco_loader = new THREEDRACOLoader.DRACOLoader();

    this.draco_loader.setDecoderPath(window.draco_decoder_path);
    this.draco_loader.setDecoderConfig({ type: 'js' });
    this.draco_loader.setWorkerLimit(1);

    this.loader.setDRACOLoader(this.draco_loader);
  }

  on_preloaded_finished(resource_container)
  {
    const ctx = this;

    this.loader.load(this.url, (gltf) =>
    {
      resource_container.set_resource(ctx.resource_id, ctx.url, gltf);

      ctx.__update_downloaded_bytes(1, 1);
      ctx.__loading_ended();
    },
    (xhr) =>
    {
      // if (xhr)
      // {
      //   let total = xhr.total || this.total_bytes;
      //   ctx.__update_downloaded_bytes(xhr.loaded, total);
      // }
    },
    (msg) =>
    {
      ctx.__set_error(msg + '\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource');
      ctx.__loading_ended();
    }
    );
  }
}
