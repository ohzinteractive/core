
class ResourceBatch
{
  constructor(batch_name, resource_container)
  {
    this.resource_loaders = [];
    this.batch_name = batch_name || 'unnamed batch';
    this.resource_container = resource_container;
  }

  add_loader(loader)
  {
    this.resource_loaders.push(loader);
  }

  load()
  {
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      this.resource_loaders[i].load(this.resource_container);
    }
  }

  get loading_finished()
  {
    let finished = true;
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      finished = finished && this.resource_loaders[i].has_finished;
    }
    return finished;
  }

  get has_errors()
  {
    let has_error = false;
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      has_error = has_error || this.resource_loaders[i].has_error;
    }
    return has_error;
  }

  print_errors()
  {
    console.error('Batch <' + this.batch_name + '> could not load successfully');
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      if (this.resource_loaders[i].has_error)
      {
        this.resource_loaders[i].print_error();
      }
    }
  }

  get_progress()
  {
    return this.get_loaded_bytes() / this.get_total_bytes();
  }

  get_loaded_bytes()
  {
    let loaded_bytes = 1;

    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      loaded_bytes += this.resource_loaders[i].loaded_bytes;
    }

    return loaded_bytes;
  }

  get_total_bytes()
  {
    let total_bytes = 1;

    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      total_bytes += this.resource_loaders[i].total_bytes;
    }

    return total_bytes;
  }
}

export { ResourceBatch };
