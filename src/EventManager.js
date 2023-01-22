class EventManager
{
  init()
  {
    this.queue = {};

    this.zoom_changed_evt           = 'zoom_changed';
    this.store_clickd_evt           = 'store_clicked';
    this.point_selected_evt         = 'point_selected';
    this.config_changed             = 'config_changed';

    this.path_substep_completed     = 'path_substep_completed';
    this.path_completed             = 'path_completed';
    this.go_to_store_requested_evt  = 'go_to_store_requested';

    this.resource_loaded_evt        = 'resource_loaded';
    this.service_clicked_evt        = 'service_clicked';
    this.unit_pos_updated_evt       = 'unit_position_updated';

    this.floor_changed_evt          = 'floor_changed';

    this.on_enter_floor_navigation  = 'on_enter_floor_navigation';
    this.on_exit_floor_navigation   = 'on_exit_floor_navigation';

    this.on_enter_floor_selection   = 'on_enter_floor_selection';
    this.on_exit_floor_selection    = 'on_exit_floor_selection';

    this.on_enter_outside_navigation  = 'on_enter_outside_navigation';
    this.on_exit_outside_navigation   = 'on_exit_outside_navigation';

    this.step_selected_evt = 'step_selected';
  }

  fire(event, payload)
  {
    const queue = this.queue[event];

    if (queue === undefined)
    {
      return;
    }
    let i = queue.length;
    while (i--)
    {
      queue[i](payload);
    }
  }

  on(event, callback)
  {
    if (typeof this.queue[event] === 'undefined')
    {
      this.queue[event] = [];
    }

    this.queue[event].push(callback);
  }

  fire_zoom_changed(zoom)
  {
    this.fire(this.zoom_changed_evt, zoom);
  }

  fire_store_selected(store_id)
  {
    this.fire(this.store_clickd_evt, store_id);
  }

  fire_point_selected(hit_data)
  {
    this.fire(this.point_selected_evt, hit_data);
  }

  fire_config_changed()
  {
    this.fire(this.config_changed);
  }

  fire_path_substep_completed(step_number)
  {
    this.fire(this.path_substep_completed, step_number);
  }

  fire_path_completed()
  {
    this.fire(this.path_completed);
  }

  fire_step_selected(step_index)
  {
    this.fire(this.step_selected_evt, step_index);
  }

  fire_go_to_store_requested(store_id)
  {
    this.fire(this.go_to_store_requested_evt, store_id);
  }

  fire_resource_loaded(resource)
  {
    this.fire(this.resource_loaded_evt, resource);
  }

  fire_service_clicked(service)
  {
    this.fire(this.service_clicked_evt, service);
  }

  fire_unit_position_updated(unit_data)
  {
    this.fire(this.unit_pos_updated_evt, unit_data);
  }

  fire_floor_switched(floor_id)
  {
    this.fire(this.floor_changed_evt, floor_id);
  }

  fire_on_enter_floor_navigation(state)
  {
    this.fire(this.on_enter_floor_navigation, state);
  }

  fire_on_exit_floor_navigation(state)
  {
    this.fire(this.on_exit_floor_navigation, state);
  }

  fire_on_enter_floor_selection(state)
  {
    this.fire(this.on_enter_floor_selection, state);
  }

  fire_on_exit_floor_selection(state)
  {
    this.fire(this.on_exit_floor_selection, state);
  }

  fire_on_enter_outside_navigation(state)
  {
    this.fire(this.on_enter_outside_navigation, state);
  }

  fire_on_exit_outside_navigation(state)
  {
    this.fire(this.on_exit_outside_navigation, state);
  }
}

const event_manager = new EventManager();
export { event_manager as EventManager };
