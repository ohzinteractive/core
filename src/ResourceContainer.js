import { EventManager } from './EventManager';

class ResourceContainer
{
  init()
  {
    this.resources = {};
    this.resources_by_url = {};
  }

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

    EventManager.fire_resource_loaded({ name: name, value: resource });
  }

  get_resource(name)
  {
    return this.resources[name];
  }

  get(name)
  {
    return this.resources[name];
  }
}

const resource_container = new ResourceContainer();
export { resource_container as ResourceContainer };
