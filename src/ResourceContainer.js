// @ts-check
import { Object3D, Texture, } from 'three'; // eslint-disable-line

/**
 * @typedef {Object3D | Texture} Resource
 */

class ResourceContainer
{
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
  set_resource(name, url, resource)
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

  /**
   * @param {string} name
   */
  get_resource(name)
  {
    return this.resources[name];
  }

  /**
   * @param {string} name
   */
  get(name)
  {
    return this.resources[name];
  }
}

const resource_container = new ResourceContainer();
export { resource_container as ResourceContainer };
