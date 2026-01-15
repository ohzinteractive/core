class ResourceContainer
{
  name: string;
  resources: Record<string, any>;
  resources_by_url: Record<string, any>;
  
  constructor(name: string)
  {
    this.name = name;
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

  get_resource(name: string)
  {
    return this.resources[name];
  }

  get(name: string)
  {
    return this.resources[name];
  }
}

export { ResourceContainer };
