import CameraManager from '../CameraManager';
import Input from '../Input';
import RaycastResolver from '../raycast/RaycastResolver';
import IdleState from './states/IdleState';

export default class GroupRaycaster
{
	constructor(raycastee_group, raycast_resolver, camera)
	{
		this.camera = camera || CameraManager.current;
		this.raycast_resolver = raycast_resolver || new RaycastResolver();
		this.raycastee_group = raycastee_group || [];

		this.raycaster = new THREE.Raycaster();
		this.current_state = new IdleState();
		this.current_intersections = undefined;
	}

	set_raycastee_group(raycastee_group)
	{
		this.raycastee_group = raycastee_group;
	}


	update()
	{
    this.raycaster.setFromCamera( Input.normalized_mouse_pos, this.camera );
    this.current_intersections = this.raycaster.intersectObjects( this.raycastee_group );
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
