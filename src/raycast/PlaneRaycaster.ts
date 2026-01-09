import { CameraUtilities } from '../utilities/CameraUtilities';
import { PlaneRaycastResolver } from './PlaneRaycastResolver';

import { Raycaster, Vector3 } from 'three';

class PlaneRaycaster
{
  current_intersected_point: any;
  raycast_resolver: any;
  raycaster: any;
  constructor(raycast_resolver: any)
  {
    this.raycast_resolver = raycast_resolver || new PlaneRaycastResolver();

    this.raycaster = new Raycaster();
    this.current_intersected_point = new Vector3();
  }

  update(reference_position: any, plane_normal: any)
  {
    this.current_intersected_point.copy(CameraUtilities.get_plane_intersection(reference_position, plane_normal));
    this.raycast_resolver.on_hover(this.current_intersected_point);
  }
}

export { PlaneRaycaster };
