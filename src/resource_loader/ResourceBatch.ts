import type { AbstractLoader } from '../../types/index';
import { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';

class ResourceBatch
{
  resource_loaders: AbstractLoader[];
  batch_name: string;

  constructor(batch_name: string)
  {
    this.resource_loaders = [];
    this.batch_name = batch_name || 'unnamed batch';
  }

  add_loader(loader: AbstractLoader)
  {
    this.resource_loaders.push(loader);
  }

  load(resource_container: ResourceContainer)
  {
    for (let i = 0; i < this.resource_loaders.length; i++)
    {
      this.resource_loaders[i].load(resource_container || ResourceContainer);
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
