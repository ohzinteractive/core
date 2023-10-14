import { ViewComponentControllerManager } from './ViewComponentControllerManager';
import { WorkerToMain } from './WorkerToMain';

class ViewComponentController
{
  constructor({ name })
  {
    this.name = name;

    this.current_opacity = 0;
    this.hidden = true;

    ViewComponentControllerManager.register_component_controller(this);
  }

  start()
  {
  }

  on_enter()
  {
    ViewComponentControllerManager.enable_component_controller(this);
    WorkerToMain.push(`${this.name}_component.on_enter`);

    this.hidden = false;
  }

  update()
  {
    WorkerToMain.push(`${this.name}_component.update`);
  }

  on_exit()
  {
    ViewComponentControllerManager.disable_component_controller(this);
    WorkerToMain.push(`${this.name}_component.on_exit`);

    this.hidden = true;
  }

  set_opacity(current_state_data)
  {
    const opacity = current_state_data[`${this.name}_opacity`];

    if (this.current_opacity > opacity || this.current_opacity < opacity)
    {
      this.current_opacity = opacity;

      WorkerToMain.push(`${this.name}_component.set_opacity`, [opacity]);
      this.toggle_hidden();
    }
  }

  toggle_hidden()
  {
    if (this.current_opacity > 0.0001)
    {
      if (this.hidden)
      {
        this.on_enter();
      }
    }
    else
    {
      if (!this.hidden)
      {
        this.on_exit();
      }
    }
  }
}

export { ViewComponentController };
