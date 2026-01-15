import type { Mesh, Texture} from 'three';
import { Object3D, Vector3 } from 'three';

class BaseObject extends Object3D
{
  ___temp_w_pos: Vector3;
  
  constructor()
  {
    super();
    this.___temp_w_pos = new Vector3();
  }

  get_world_pos(): Vector3
  {
    this.getWorldPosition(this.___temp_w_pos);
    return this.___temp_w_pos;
  }

  deep_dispose(obj: Object3D | Mesh): void
  {
    if (obj !== null)
    {
      for (let i = 0; i < obj.children.length; i++)
      {
        this.deep_dispose(obj.children[i]);
      }

      if ('geometry' in obj)
      {
        obj.geometry.dispose();
      }
      if ('material' in obj)
      {
        if ('map' in obj.material)
        {
          const map = obj.material.map as unknown as Texture;

          map.dispose();
        }

        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
    if (obj.parent)
    {
      obj.parent.remove(obj);
    }
  }
}

export { BaseObject };
