import RaycastResolver from '/RaycastResolver';
import GroupRaycaster from '/GroupRaycaster';
import Input from '/Input';

export default class SurfaceDragResolver extends RaycastResolver
{
	constructor(surface_mesh)
	{
		super();
		this._drag_started = false;
		this._group_raycaster = new GroupRaycaster([surface_mesh], this);
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
	_on_update()
	{

	}

	get drag_started()
	{
		return this._drag_started;
	}


	on_hover(intersected_object, intersection_data){

		if(Input.left_mouse_button_released && this._drag_started)
		{
			this._drag_started = false;
			this.on_drag_end();
		}

		if(this.drag_started)
		{
			this.on_drag_move(intersection_data.point);
		}

		if(Input.left_mouse_button_pressed)
		{
			this.on_drag_start(intersection_data.point);
			this._drag_started = true;
		}

	}

	on_exit(){
		if(this.drag_started)
		{
			this.on_drag_end();
			this._drag_started = false;
		}


	}


	update()
	{
		this._group_raycaster.update();
		this._on_update();
	}

}
