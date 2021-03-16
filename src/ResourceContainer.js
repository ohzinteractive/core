import EventManager from './EventManager';

class ResourceContainer
{
  init()
  {
    this.resources = {};
  }

  set_resource(name, resource)
  {
    this.resources[name] = resource;
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

export default new ResourceContainer();
