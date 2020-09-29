
import PlaneRaycastResolver from './PlaneRaycastResolver';
import CameraUtilities from '../utilities/CameraUtilities';

import { Raycaster } from 'three';
import { Vector3 } from 'three';

export default class PlaneRaycaster
{
  constructor(raycast_resolver)
  {
    this.raycast_resolver = raycast_resolver || new PlaneRaycastResolver();

    this.raycaster = new Raycaster();
    this.current_intersected_point = new Vector3();
  }

  update(reference_position, plane_normal)
  {
    this.current_intersected_point.copy(CameraUtilities.get_plane_intersection(reference_position, plane_normal));
    this.raycast_resolver.on_hover(this.current_intersected_point);
  }
}
