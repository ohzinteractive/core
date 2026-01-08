import { CameraManager } from '../CameraManager';
import { RaycastResolver } from './RaycastResolver';
import { IdleState } from './states/IdleState';

import { Raycaster } from 'three';

class GroupRaycaster
{
  constructor(raycastee_group, raycast_resolver, camera, input)
  {
    this.camera = camera || CameraManager.current;
    this.raycast_resolver = raycast_resolver || new RaycastResolver();
    this.raycastee_group = raycastee_group || [];
    this.input = input;

    this.raycaster = new Raycaster();
    this.current_state = new IdleState();
    this.current_intersections = undefined;
  }

  set_raycastee_group(raycastee_group)
  {
    this.raycastee_group = raycastee_group;
  }

  update()
  {
    this.raycaster.setFromCamera(this.input.NDC, this.camera);
    this.current_intersections = this.raycaster.intersectObjects(this.raycastee_group);
    this.current_state.update(this);
  }

  set_state(new_state)
  {
    // console.log("GroupRaycaster switch state to:" + new_state.constructor.name);

    this.current_state.on_exit(this);
    this.current_state = new_state;
    this.current_state.on_enter(this);
  }
}

export { GroupRaycaster };
