import { Vector3 } from 'three';

class ReflectionPlaneContext
{
  constructor()
  {
    this.target_geometry = undefined;
    this.target_position = new Vector3();
  }

  set_target_geometry(geometry)
  {
    this.target_geometry = geometry;
  }
}

export default new ReflectionPlaneContext();
