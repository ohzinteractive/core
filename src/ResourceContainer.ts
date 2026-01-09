import { Object3D, Texture, } from 'three';

/**
 * @typedef {Object3D | Texture} Resource
 */

class ResourceContainer
{
  resources: any;
  resources_by_url: any;

  init()
  {
    /** @type {Record<string, Resource>} */
    this.resources = {};

    /** @type {Record<string, any>} */
    this.resources_by_url = {};
  }

  /**
   * @param {string} name
   * @param {string} url
   * @param {Resource} resource
   */
  set_resource(name: string, url: string, resource: ResourceContainer)
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

  get_resource(name: string)
  {
    return this.resources[name];
  }

  get(name: string)
  {
    return this.resources[name];
  }
}

const resource_container = new ResourceContainer();
export { resource_container as ResourceContainer };
