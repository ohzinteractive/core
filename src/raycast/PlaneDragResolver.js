import RaycastResolver from './RaycastResolver';
import PlaneRaycaster from './PlaneRaycaster';
import PlaneRaycastResolver from './PlaneRaycastResolver';
import Input from '/Input';

export default class PlaneDragResolver extends PlaneRaycastResolver
{
	constructor()
	{
		super();
		this._drag_started = false;
		this._plane_raycaster = new PlaneRaycaster(this);
	}

	// @virtual
	on_drag_start(contact_point){
		// console.log("on_drag_start");
	}
	// @virtual
	on_drag_move(contact_point){
		// console.log("on_drag_move");
	}
	// @virtual
	on_drag_end(){
		// console.log("on_drag_end");
	}
	// @virtual
	on_update()
	{

	}



	// @virtual
	on_drag_button_pressed()
	{
		return Input.left_mouse_button_pressed;
	}
	// @virtual
	on_drag_button_released()
	{
		return Input.left_mouse_button_released;
	}

	on_hover(intersection_point){

		if(this.on_drag_button_released() && this._drag_started)
		{
			this._drag_started = false;
			this.on_drag_end();
		}

		if(this.drag_started)
		{
			this.on_drag_move(intersection_point);
		}

		if(this.on_drag_button_pressed())
		{
			this.on_drag_start(intersection_point);
			this._drag_started = true;
		}

	}

	get drag_started()
	{
		return this._drag_started;
	}

	on_exit(){
		if(this.drag_started)
		{
			this.on_drag_end();
			this._drag_started = false;
		}
	}


	update(reference_position, plane_normal)
	{
		this._plane_raycaster.update(reference_position, plane_normal);
		this.on_update();
	}

}
