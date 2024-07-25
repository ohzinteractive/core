// We use custom ResourceBatch, ResourceContainer and AbstractLoader to reduce build size
import { ResourceBatch } from './ResourceBatch';
import { ResourceContainer } from './ResourceContainer';
import { AssetLoader } from './AssetLoader';
import { ResourceLoaderChecker } from './ResourceLoaderChecker';

class AsyncAssetsLoaderWorker
{
  run()
  {
    this.assets = {};
    this.resource_batches = {};
    this.resource_container = new ResourceContainer('worker');
    this.resource_loader_checkers = {};

    this.__bind_messages();
  }

  __bind_messages()
  {
    self.addEventListener('message', (e) =>
    {
      const message = e.data;

      switch (message.type)
      {
      case 'assets':
        this.assets[message.loader_name] = this.assets[message.loader_name] ? this.assets[message.loader_name] : [];
        this.assets[message.loader_name] = this.assets[message.loader_name].concat(message.data);

        break;
      case 'load':
        this.__setup_batch(message.loader_name);

        this.resource_batches[message.loader_name].load();
        this.resource_loader_checkers[message.loader_name].setup(this.on_assets_ready.bind(this, message.loader_name), 10);
        this.resource_loader_checkers[message.loader_name].check();

        break;
      case 'reset':
        // TODO: maybe not necessary anymore
        this.assets[message.loader_name] = [];

        break;
      }
    });
  }

  on_assets_ready(loader_name)
  {
    postMessage({ type: `asset_loaded_${loader_name}`, data: this.resource_container.resources });
  }

  __setup_batch(loader_name)
  {
    // this.resource_containers[loader_name] = new ResourceContainer(loader_name);
    this.resource_batches[loader_name] = new ResourceBatch(loader_name, this.resource_container);
    this.resource_loader_checkers[loader_name] = new ResourceLoaderChecker(this.resource_batches[loader_name]);

    for (let i = 0; i < this.assets[loader_name].length; i++)
    {
      const asset = this.assets[loader_name][i];

      this.resource_batches[loader_name].add_loader(new AssetLoader(asset.name, asset.url, asset.size));
    }
  }
}

new AsyncAssetsLoaderWorker().run();
