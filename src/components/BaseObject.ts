
import { Mesh, Object3D, Vector3 } from 'three';

class BaseObject extends Object3D
{
  ___temp_w_pos: any;
  constructor()
  {
    super();
    this.___temp_w_pos = new Vector3();
  }

  get_world_pos()
  {
    this.getWorldPosition(this.___temp_w_pos);
    return this.___temp_w_pos;
  }

  /**
   * @param {Object3D | Mesh} obj
   */
  deep_dispose(obj: any)
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
          obj.material.map.dispose();
        }
        obj.material.dispose();
      }
    }
    if (obj.parent)
    {
      obj.parent.remove(obj);
    }
  }
}

export { BaseObject };
