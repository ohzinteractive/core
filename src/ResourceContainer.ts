class ResourceContainer
{
  resources: Record<string, any>;
  resources_by_url: Record<string, any>;

  init()
  {
    this.resources = {};

    this.resources_by_url = {};
  }

  set_resource(name: string, url: string, resource: any)
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

  // set_resource keeps the first resource stored for a url. A model loaded
  // again from the same url after its file changed needs to win instead.
  replace_resource(name: string, url: string, resource: any)
  {
    this.resources[name] = resource;
    this.resources_by_url[url] = resource;
  }

  get_resource(name: string): any
  {
    return this.resources[name];
  }

  get(name: string): any
  {
    return this.resources[name];
  }
}

const resource_container = new ResourceContainer();
export { resource_container as ResourceContainer };
