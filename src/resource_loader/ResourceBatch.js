import TextureLoader from './TextureLoader';
import GLTFLoader from './GLTFLoader';
import DAELoader from './DAELoader';
import TextLoader from './TextLoader';
import CubemapLoader from './CubemapLoader';
import AudioLoader from './AudioLoader';
import JSONLoader from './JSONLoader';
import OBJLoader from './OBJLoader';
import FontLoader from './FontLoader';
import RGBETextureLoader from './RGBETextureLoader';
import PointArrayLoader from './PointArrayLoader';
import HDRCubeTextureLoader from './HDRCubeTextureLoader';
import GLTFDRACOLoader from './GLTFDRACOLoader';
import BasisLoader from './BasisLoader';
import ResourceContainer from '../ResourceContainer';
import FileLoader from './FileLoader';
import VideoLoader from './VideoLoader';

export default class ResourceBatch
{
  constructor(batch_name)
  {
    this.resource_loaders = [];
    this.batch_name = batch_name || 'unnamed batch';
  }

  add_texture(resource_id, url, size)
  {
    this.resource_loaders.push(new TextureLoader(resource_id, url, size));
  }

  add_gltf(resource_id, url, size)
  {
    this.resource_loaders.push(new GLTFLoader(resource_id, url, size));
  }

  add_basis(resource_id, url, renderer, loader, size)
  {
    this.resource_loaders.push(new BasisLoader(resource_id, url, renderer, loader, size));
  }

  add_gltf_draco(resource_id, url, size)
  {
    this.resource_loaders.push(new GLTFDRACOLoader(resource_id, url, size));
  }

  add_dae(resource_id, url, size)
  {
    this.resource_loaders.push(new DAELoader(resource_id, url, size));
  }

  add_obj(resource_id, url, size)
  {
    this.resource_loaders.push(new OBJLoader(resource_id, url, size));
  }

  add_file(resource_id, url, size)
  {
    this.resource_loaders.push(new FileLoader(resource_id, url, size));
  }

  add_text(resource_id, url, size)
  {
    this.resource_loaders.push(new TextLoader(resource_id, url, size));
  }

  add_cubemap(resource_id, url, size)
  {
    this.resource_loaders.push(new CubemapLoader(resource_id, url, size));
  }

  add_audio(resource_id, url, loop, volume, size)
  {
    this.resource_loaders.push(new AudioLoader(resource_id, url, loop, volume, size));
  }

  add_video(resource_id, url, size)
  {
    this.resource_loaders.push(new VideoLoader(resource_id, url, size));
  }

  add_json(resource_id, url, size)
  {
    this.resource_loaders.push(new JSONLoader(resource_id, url, size));
  }

  add_point_array(resource_id, url, size)
  {
    this.resource_loaders.push(new PointArrayLoader(resource_id, url, size));
  }

  add_hdr(resource_id, url, size)
  {
    this.resource_loaders.push(new RGBETextureLoader(resource_id, url, size));
  }

  add_hdr_cubemap(resource_id, url, size)
  {
    this.resource_loaders.push(new HDRCubeTextureLoader(resource_id, url, size));
  }

  add_font(resource_id, url, size)
  {
    this.resource_loaders.push(new FontLoader(resource_id, url, size));
  }

  add_loader(loader)
  {
    this.resource_loaders.push(loader);
  }

  load(resource_container)
  {
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      this.resource_loaders[i].load(resource_container || ResourceContainer);
    }
  }

  get loading_finished()
  {
    let finished = true;
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      finished = finished && this.resource_loaders[i].has_finished;
    }
    return finished;
  }

  get has_errors()
  {
    let has_error = false;
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      has_error = has_error || this.resource_loaders[i].has_error;
    }
    return has_error;
  }

  print_errors()
  {
    console.error('Batch <' + this.batch_name + '> could not load successfully');
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      if (this.resource_loaders[i].has_error)
      {
        this.resource_loaders[i].print_error();
      }
    }
  }

  get_progress()
  {
    return this.get_loaded_bytes() / this.get_total_bytes();
  }

  get_loaded_bytes()
  {
    let loaded_bytes = 1;

    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      loaded_bytes += this.resource_loaders[i].loaded_bytes;
    }

    return loaded_bytes;
  }

  get_total_bytes()
  {
    let total_bytes = 1;

    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      total_bytes += this.resource_loaders[i].total_bytes;
    }

    return total_bytes;
  }
}
