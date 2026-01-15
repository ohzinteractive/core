import { CameraManager } from '../CameraManager';
import type { Input } from '../components/Input';
import { RaycastResolver } from './RaycastResolver';
import { IdleState } from './states/IdleState';

import type { Camera, Intersection, Object3D } from 'three';
import { Raycaster } from 'three';
import type { BaseState } from './states/BaseState';

class GroupRaycaster
{
  camera: Camera;
  current_intersections: Intersection[];
  current_state: IdleState;
  input: Input;
  raycast_resolver: RaycastResolver;
  raycastee_group: Object3D[];
  raycaster: Raycaster;

  constructor(raycastee_group: Object3D[], raycast_resolver: RaycastResolver, camera: Camera, input: Input)
  {
    this.camera = camera || CameraManager.current;
    this.raycast_resolver = raycast_resolver || new RaycastResolver();
    this.raycastee_group = raycastee_group || [];
    this.input = input;

    this.raycaster = new Raycaster();
    this.current_state = new IdleState();
    this.current_intersections = undefined;
  }

  set_raycastee_group(raycastee_group: Object3D[])
  {
    this.raycastee_group = raycastee_group;
  }

  update()
  {
    this.raycaster.setFromCamera(this.input.NDC, this.camera);
    this.current_intersections = this.raycaster.intersectObjects(this.raycastee_group);
    this.current_state.update(this);
  }

  set_state(new_state: BaseState)
  {
    // console.log("GroupRaycaster switch state to:" + new_state.constructor.name);

    this.current_state.on_exit(this);
    this.current_state = new_state;
    this.current_state.on_enter(this);
  }
}

export { GroupRaycaster };
