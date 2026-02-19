import type { Vector3 } from 'three';
import type { Input } from '../lib/Input';
import { PlaneRaycaster } from './PlaneRaycaster';
import { PlaneRaycastResolver } from './PlaneRaycastResolver';

class PlaneDragResolver extends PlaneRaycastResolver
{
  _drag_started: boolean;
  _plane_raycaster: PlaneRaycaster;
  input: Input;
  constructor(input: Input)
  {
    super();
    this._drag_started = false;
    this._plane_raycaster = new PlaneRaycaster(this);

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
  on_update()
  {

  }

  // @virtual
  on_drag_button_pressed(): boolean
  {
    return this.input.left_mouse_button_pressed;
  }

  // @virtual
  on_drag_button_released(): boolean
  {
    return this.input.left_mouse_button_released;
  }

  on_hover(intersection_point: Vector3)
  {
    if (this.on_drag_button_released() && this._drag_started)
    {
      this._drag_started = false;
      this.on_drag_end();
    }

    if (this.drag_started)
    {
      this.on_drag_move(intersection_point);
    }

    if (this.on_drag_button_pressed())
    {
      this.on_drag_start(intersection_point);
      this._drag_started = true;
    }
  }
  
  get drag_started()
  {
    return this._drag_started;
  }

  on_exit()
  {
    if (this.drag_started)
    {
      this.on_drag_end();
      this._drag_started = false;
    }
  }

  update(reference_position: any, plane_normal: any)
  {
    this._plane_raycaster.update(reference_position, plane_normal);
    this.on_update();
  }
}

export { PlaneDragResolver };
