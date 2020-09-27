import CameraManager from '/CameraManager';
import Input from '/Input';
import PlaneRaycastResolver from '/raycast/PlaneRaycastResolver';
import CameraUtilities from '/utilities/CameraUtilities';
import * as THREE from 'three';

export default class PlaneRaycaster
{
  constructor(raycast_resolver)
  {
    this.raycast_resolver = raycast_resolver || new PlaneRaycastResolver();

    this.raycaster = new THREE.Raycaster();
    this.current_intersected_point = new THREE.Vector3();
  }

  update(reference_position, plane_normal)
  {
    this.current_intersected_point.copy(CameraUtilities.get_plane_intersection(reference_position, plane_normal));
  	this.raycast_resolver.on_hover(this.current_intersected_point);
  }
}
