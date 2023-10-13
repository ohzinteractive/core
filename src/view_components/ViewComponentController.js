import { ViewComponentManager } from './ViewComponentManager';
import { WorkerToMain } from './WorkerToMain';

class ViewComponentController
{
  constructor({ name })
  {
    this.name = name;

    this.current_opacity = 0;

    ViewComponentManager.register_component(this);
  }

  start()
  {
  }

  on_enter()
  {
    ViewComponentManager.enable_component(this);
    WorkerToMain.push(`${this.name}_view.on_enter`);
  }

  update()
  {
    WorkerToMain.push(`${this.name}_view.update`);
  }

  on_exit()
  {
    ViewComponentManager.disable_component(this);
    WorkerToMain.push(`${this.name}_view.on_exit`);
  }

  set_opacity(current_state_data)
  {
    const opacity = current_state_data[`${this.name}_opacity`];

    if (this.current_opacity > opacity || this.current_opacity < opacity)
    {
      this.current_opacity = opacity;

      WorkerToMain.push(`${this.name}_view.set_opacity`, [opacity]);
    }
  }
}

export { ViewComponentController };
