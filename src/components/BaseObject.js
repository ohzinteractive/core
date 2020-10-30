
import { Object3D } from 'three';
import { Vector3 } from 'three';

export default class BaseObject extends Object3D
{
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

  deep_dispose(obj)
  {
    if (obj !== null)
    {
      for (let i = 0; i < obj.children.length; i++)
      {
        this.deep_dispose(obj.children[i]);
      }
      if (obj.geometry)
      {
        obj.geometry.dispose();
      }
      if (obj.material)
      {
        if (obj.material.map)
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
