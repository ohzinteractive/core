import { AsyncTextureLoader } from '../resource_loader/AsyncTextureLoader';
import { BasisLoader } from '../resource_loader/BasisLoader';
import { CubemapLoader } from '../resource_loader/CubemapLoader';
import { HDRCubeTextureLoader } from '../resource_loader/HDRCubeTextureLoader';
import { HDRTextureLoader } from '../resource_loader/HDRTextureLoader';
import { ResourceContainer } from '../ResourceContainer';
import { AsyncAbstractLoader } from './AsyncAbstractLoader';

class AsyncTexturesLoader extends AsyncAbstractLoader
{
  constructor(scene_name: string, assets: any[], worker: Worker)
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

      switch (asset_data.kind)
      {
      case 'regular':
        loaders.push(new AsyncTextureLoader(
          asset_data.name,
          asset_data.url,
          asset_data.size,
          asset_data.flipY,
          asset_data.premultiplyAlpha,
          asset_data.colorSpaceConversion
        ));

        break;
      case 'basis':
        loaders.push(new BasisLoader(
          asset_data.name,
          asset_data.url,
          ResourceContainer.get('basis_loader'),
          asset_data.size
        ));

        break;
      case 'hdr':
        loaders.push(new HDRTextureLoader(
          asset_data.name,
          asset_data.url,
          asset_data.size
        ));

        break;
      case 'cubemap':
        loaders.push(new CubemapLoader(
          asset_data.name,
          asset_data.url,
          asset_data.extension,
          asset_data.size
        ));
        break;
      case 'cubemap_hdr':
        loaders.push(new HDRCubeTextureLoader(
          asset_data.name,
          asset_data.url,
          asset_data.extension,
          asset_data.size
        ));

        break;
      default:
        break;
      }
    }

    return loaders;
  }
}

export { AsyncTexturesLoader };
