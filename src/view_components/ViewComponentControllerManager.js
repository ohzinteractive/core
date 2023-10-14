import { TransitionManager } from './TransitionManager';

class ViewComponentControllerManager
{
  constructor()
  {
    this.component_controllers = [];
    this.enabled_component_controllers = new Set();
  }

  update()
  {
    this.__set_component_controllers_opacities();

    for (const component_controller of this.enabled_component_controllers)
    {
      component_controller.update(TransitionManager.current_state_data);
    }
  }

  register_component_controller(component_controller)
  {
    this.component_controllers.push(component_controller);
  }

  enable_component_controller(component_controller)
  {
    this.enabled_component_controllers.add(component_controller);
  }

  disable_component_controller(component_controller)
  {
    this.enabled_component_controllers.delete(component_controller);
  }

  get(component_name)
  {
    for (let i = 0; i < this.component_controllers.length; i++)
    {
      if (this.component_controllers[i].name === component_name)
      {
        return this.component_controllers[i];
      }
    }
    console.error('[ViewComponentControllerManager.get] no component_controller found for: ', component_name);
    return undefined;
  }

  __set_component_controllers_opacities()
  {
    for (let i = 0; i < this.component_controllers.length; i++)
    {
      this.component_controllers[i].set_opacity(TransitionManager.current_state_data);
    }
  }
}

const view_component_contorller_manager = new ViewComponentControllerManager();
export { view_component_contorller_manager as ViewComponentControllerManager };
