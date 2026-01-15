import type { Object3D, Texture } from 'three';

class ResourceContainer
{
  resources: Record<string, Object3D | Texture>;
  resources_by_url: Record<string, any>;

  init()
  {
    this.resources = {};

    this.resources_by_url = {};
  }

  set_resource(name: string, url: string, resource: Object3D | Texture)
  {
    const urls = Object.keys(this.resources_by_url);

    if (urls.includes(url))
    {
      this.resources[name] = this.resources_by_url[url];
    }
    else
    {
      this.resources[name] = resource;
      this.resources_by_url[url] = resource;
    }
  }

  get_resource(name: string): Object3D | Texture
  {
    return this.resources[name];
  }

  get(name: string): Object3D | Texture
  {
    return this.resources[name];
  }
}

const resource_container = new ResourceContainer();
export { resource_container as ResourceContainer };
