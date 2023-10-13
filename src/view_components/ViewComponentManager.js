import { TransitionManager } from './TransitionManager';

// TODO: ver que hacer con esto
class ViewComponentManager
{
  constructor()
  {
    this.components = [];
    this.enabled_components = new Set();
  }

  update()
  {
    this.__set_components_opacities();

    for (const component of this.enabled_components)
    {
      component.update(TransitionManager.current_state_data);
    }
  }

  register_component(component)
  {
    this.components.push(component);
  }

  enable_component(component)
  {
    this.enabled_components.add(component);
  }

  disable_component(component)
  {
    this.enabled_components.delete(component);
  }

  get(component_name)
  {
    for (let i = 0; i < this.components.length; i++)
    {
      if (this.components[i].name === component_name)
      {
        return this.components[i];
      }
    }
    console.error('[ViewComponentManager.get] no component found for: ', component_name);
    return undefined;
  }

  __set_components_opacities()
  {
    for (let i = 0; i < this.components.length; i++)
    {
      this.components[i].set_opacity(TransitionManager.current_state_data);
    }
  }
}

const view_component_manager = new ViewComponentManager();
export { view_component_manager as ViewComponentManager };
