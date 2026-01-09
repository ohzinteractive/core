import { GroupRaycaster } from './GroupRaycaster';
import { RaycastResolver } from './RaycastResolver';

class SurfaceDragResolver extends RaycastResolver
{
  _drag_started: any;
  _group_raycaster: any;
  input: any;
  
  constructor(surface_mesh: any, input: any)
  {
    super();
    this._drag_started = false;
    this._group_raycaster = new GroupRaycaster([surface_mesh], this, undefined, input);

    this.input = input;
  }

  // @virtual
  on_drag_start(contact_point: any)
  {
    // console.log("on_drag_start");
  }

  // @virtual
  on_drag_move(contact_point: any)
  {
    // console.log("on_drag_move");
  }

  // @virtual
  on_drag_end()
  {
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

  on_hover(intersected_object: any)
  {
    // Extract intersection data from the intersected object or use a different approach
    const intersection_data = intersected_object; // Adjust this based on your data structure
    
    if (this.input.left_mouse_button_released && this._drag_started)
    {
      this._drag_started = false;
      this.on_drag_end();
    }

    if (this.drag_started)
    {
      this.on_drag_move(intersection_data.point);
    }

    if (this.input.left_mouse_button_pressed)
    {
      this.on_drag_start(intersection_data.point);
      this._drag_started = true;
    }
  }

  on_exit()
  {
    if (this.drag_started)
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

export { SurfaceDragResolver };
