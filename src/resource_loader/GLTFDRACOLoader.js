import AbstractLoader from './AbstractLoader';

import * as THREEGLTFLoader from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREEDRACOLoader from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Math as THREEMath } from 'three';

export default class GLTFDRACOLoader extends AbstractLoader
{
  constructor(resource_id, url, size)
  {
    super(resource_id, url, size);
    this.loader = new THREEGLTFLoader.GLTFLoader();
    this.draco_loader = new THREEDRACOLoader.DRACOLoader();

    this.draco_loader.setDecoderPath(window.draco_decoder_path);
    this.draco_loader.setDecoderConfig({ type: 'js' });
    this.loader.setDRACOLoader(this.draco_loader);
  }

  load(resource_container)
  {
    let ctx = this;

    this.loader.load(this.url, (gltf) =>
    {
      resource_container.set_resource(ctx.resource_id, gltf);
      ctx.__update_progress(1);
      ctx.__loading_ended();
    },
    (xhr) =>
    {
      if (xhr)
      {
        let total = xhr.total || this.size;
        ctx.__update_progress(THREEMath.clamp(xhr.loaded / total), 0, 1);
      }
    },
    (msg) =>
    {
      ctx.__set_error(msg + '\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource');
      ctx.__loading_ended();
    }
    );
  }
}
