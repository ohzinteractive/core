class ResourceLoaderChecker
{
  constructor(batch)
  {
    this.batch = batch;
    this.on_resources_loaded = undefined;
    this.timeout = 10;
  }

  setup(on_resources_loaded, timeout = 10)
  {
    this.on_resources_loaded = on_resources_loaded;
    this.timeout = timeout;
  }

  check()
  {
    if (this.batch.loading_finished)
    {
      if (this.batch.has_errors)
      {
        this.batch.print_errors();
      }
      else
      {
        this.on_resources_loaded();
      }
    }
    else
    {
      setTimeout(function()
      {
        this.check(this.batch, this.on_resources_loaded);
      }.bind(this), this.timeout);
    }
  }
}

export { ResourceLoaderChecker };
