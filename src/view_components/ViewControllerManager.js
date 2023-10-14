import { TransitionManager } from './TransitionManager';

class ViewControllerManager
{
  constructor()
  {
    this.view_controllers = [];
  }

  go_to_view_controller(view_controller_name, skip = false)
  {
    const v = this.get(view_controller_name);
    TransitionManager.transition_handler.go_to_state(v, skip);
  }

  update()
  {
    this.__set_view_controllers_opacities();
  }

  register_view_controller(view_controller)
  {
    this.view_controllers.push(view_controller);
  }

  set_view_controller(view_controller_name)
  {
    const view_controller = this.get(view_controller_name);

    TransitionManager.transition_handler.set_state(view_controller);
  }

  get_current_view_controller()
  {
    return TransitionManager.transition_handler.current_state;
  }

  get(view_controller_name)
  {
    for (let i = 0; i < this.view_controllers.length; i++)
    {
      if (this.view_controllers[i].name === view_controller_name)
      {
        return this.view_controllers[i];
      }
    }
    console.error('[ViewControllerManager.get] no view controller found for: ', view_controller_name);
    return undefined;
  }

  // get_by_url(url)
  // {
  //   for (let i = 0; i < this.view_controllers.length; i++)
  //   {
  //     if (this.view_controllers[i].url === url)
  //     {
  //       return this.view_controllers[i];
  //     }
  //   }
  //   console.error('[ViewControllerManager.get_by_url] no view controller found for: ', url);
  //   return undefined;
  // }

  __set_view_controllers_opacities()
  {
    for (let i = 0; i < this.view_controllers.length; i++)
    {
      this.view_controllers[i].set_opacity(TransitionManager.transition_handler.current_state_data);
    }
  }

  __capitalize(string)
  {
    let aux_string = string.toUpperCase().replace('/', '');
    aux_string = this.__snake_to_whitespace(aux_string);

    return aux_string;
  }

  __snake_to_whitespace(string)
  {
    return string.replace(
      /([-_][A-Z])/g,
      (group) => group
        .replace('-', ' ')
        .replace('_', ' ')
    );
  }
}

const view_controller_manager = new ViewControllerManager();
export { view_controller_manager as ViewControllerManager };
