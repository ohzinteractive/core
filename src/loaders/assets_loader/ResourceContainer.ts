class ResourceContainer
{
  name: any;
  resources: any;
  resources_by_url: any;
  constructor(name: any)
  {
    this.name = name;
    this.resources = {};
    this.resources_by_url = {};
  }

  set_resource(name: any, url: any, resource: any)
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

  get_resource(name: any)
  {
    return this.resources[name];
  }

  get(name: any)
  {
    return this.resources[name];
  }
}

export { ResourceContainer };
