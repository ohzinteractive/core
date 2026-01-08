
class ResourceContainer
{
  constructor(name)
  {
    this.name = name;
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

export { ResourceContainer };
