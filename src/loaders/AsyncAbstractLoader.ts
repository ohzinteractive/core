import { ResourceContainer } from '../ResourceContainer';

class AsyncAbstractLoader
{
  assets: any[];
  assets_loaders: any[];
  bound_on_message: any;
  name: string;
  resource_container: any;
  worker: Worker;

  constructor(name: string, assets: any[], worker: Worker)
  {
    this.resource_container = ResourceContainer;
    this.assets = assets;
    this.name = name;

    this.worker = worker;

    this.bound_on_message = this.on_message.bind(this);

    this.__setup_worker();

    this.assets_loaders = this.__setup_loaders();
  }

  load()
  {
    this.worker.postMessage({ type: 'load', loader_name: this.name });
  }

  is_loaded()
  {
    for (let i = 0; i < this.assets_loaders.length; i++)
    {
      const asset_loader = this.assets_loaders[i];

      if (!asset_loader.has_finished)
      {
        return false;
      }
      else
      {
        if (asset_loader.has_error)
        {
          // Restore original url so the error message make more sense
          asset_loader.url = asset_loader.original_url;

          asset_loader.print_error();
        }
      }
    }

    return true;
  }

  get_progress()
  {
    return this.__get_loaded_bytes() / this.__get_total_bytes();
  }

  __get_loaded_bytes()
  {
    let loaded_bytes = 1;

    for (let i = 0; i < this.assets_loaders.length; i++)
    {
      loaded_bytes += this.assets_loaders[i].loaded_bytes;
    }

    return loaded_bytes;
  }

  __get_total_bytes()
  {
    let total_bytes = 1;

    for (let i = 0; i < this.assets_loaders.length; i++)
    {
      total_bytes += this.assets_loaders[i].total_bytes;
    }

    return total_bytes;
  }

  get_assets_names()
  {
    const names = [];

    for (let i = 0; i < this.assets.length; i++)
    {
      const asset = this.assets[i];

      names.push(asset.name);
    }

    return names;
  }

  static create_worker()
  {
    const worker = new Worker(
      new URL('./assets_loader/AsyncAssetsLoaderWorker.ts', import.meta.url),
      { name: 'OHZI - AssetLoader', type: 'module' });

    return worker;
  }

  __setup_worker()
  {
    this.worker.addEventListener('message', this.bound_on_message);

    this.worker.postMessage({ type: 'assets', loader_name: this.name, data: this.assets });
  }

  on_message(e: any)
  {
    const message = e.data;

    switch (message.type)
    {
    case `asset_loaded_${this.name}`:
      this.__on_assets_loaded(message.data);
      break;
    }
  }

  __on_assets_loaded(resources: any)
  {
    this.worker.removeEventListener('message', this.bound_on_message);

    for (let i = 0; i < this.assets_loaders.length; i++)
    {
      const asset_loader = this.assets_loaders[i];

      // Save original url to show in a possible error
      asset_loader.original_url = asset_loader.url;

      asset_loader.url = resources[asset_loader.resource_id];

      asset_loader.on_preloaded_finished(this.resource_container);
    }
  }

  __setup_loaders(): any[]
  {
    console.warn('Not implemented');
    return [];
  }
}

export { AsyncAbstractLoader };
