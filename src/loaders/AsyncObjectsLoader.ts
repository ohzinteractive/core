// @ts-check
import { GLTFDRACOLoader } from '../resource_loader/GLTFDRACOLoader';
import { GLTFLoader } from '../resource_loader/GLTFLoader';
import { ResourceContainer } from '../ResourceContainer';
import { AsyncAbstractLoader } from './AsyncAbstractLoader';

class AsyncObjectsLoader extends AsyncAbstractLoader
{
  /**
   * @param {string} scene_name
   * @param {any[]} assets
   * @param {Worker} worker
   */
  constructor(scene_name, assets, worker)
  {
    super(scene_name, assets, worker);
  }

  // Called from parent
  __setup_loaders()
  {
    const loaders = [];

    for (let i = 0; i < this.assets.length; i++)
    {
      const asset_data = this.assets[i];

      if (asset_data.draco)
      {
        const draco_loader = ResourceContainer.get('draco_loader');

        loaders.push(new GLTFDRACOLoader(asset_data.name, asset_data.url, draco_loader, asset_data.size));
      }
      else
      {
        loaders.push(new GLTFLoader(asset_data.name, asset_data.url, asset_data.size));
      }
    }

    return loaders;
  }
}

export { AsyncObjectsLoader };
