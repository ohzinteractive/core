import { Vector3 } from 'three';

class ReflectionPlaneContext
{
  init()
  {
    this.target_geometry = undefined;
    this.target_position = new Vector3();
  }

  set_target_geometry(geometry)
  {
    this.target_geometry = geometry;
  }
}

const reflection_plane_context = new ReflectionPlaneContext();
export { reflection_plane_context as ReflectionPlaneContext };
