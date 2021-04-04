import ViewManager from './ViewManager';

class ViewComponentManager
{
  constructor()
  {
    this.components = [];
  }

  update()
  {
    for (let i = 0; i < this.components.length; i++)
    {
      this.components[i].update(ViewManager.transition_handler.current_state_data);
    }
  }

  register_component(component)
  {
    this.components.push(component);
  }

  get_component_by_name(component_name)
  {
    for (let i = 0; i < this.components.length; i++)
    {
      if (this.components[i].name === component_name)
      {
        return this.components[i];
      }
    }
    console.error('get_component_by_name no component found for: ', component_name);
    return undefined;
  }
}

export default new ViewComponentManager();
