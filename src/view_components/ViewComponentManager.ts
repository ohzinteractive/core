import type { ViewComponent } from '../view_components/ViewComponent';
import { TransitionManager } from './TransitionManager';

class ViewComponentManager
{
  components: ViewComponent[];
  enabled_components: Set<ViewComponent>;
  
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

  register_component(component: ViewComponent)
  {
    this.components.push(component);
  }

  enable_component(component: ViewComponent)
  {
    // const component_to_enable = this.get_component_by_name(component_name);

    this.enabled_components.add(component);
  }

  disable_component(component: ViewComponent)
  {
    // const component_to_disable = this.get_component_by_name(component_name);

    this.enabled_components.delete(component);
  }

  get_component_by_name(component_name: any)
  {
    console.warn('DEPRECATED. Use ViewComponentManager.get instead');
    this.get(component_name);
  }

  get(component_name: any)
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
