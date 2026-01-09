import { ViewComponentManager } from './ViewComponentManager';

export class ViewComponent
{
  container: any;
  hidden: any;
  name: any;
  constructor({
    name,
    container
  }: any)
  {
    this.name = name;
    this.container = container;
    this.hidden = true;

    ViewComponentManager.register_component(this);
  }

  start()
  {
  }

  on_enter()
  {
    this.container.classList.remove('hidden');
    ViewComponentManager.enable_component(this);

    this.hidden = false;
  }

  update()
  {
  }

  on_exit()
  {
    this.container.classList.add('hidden');
    ViewComponentManager.disable_component(this);

    this.hidden = true;
  }

  set_opacity(current_state_data: any)
  {
    this.container.style.opacity = current_state_data[`${this.name}_opacity`];
    this.toggle_hidden();
  }

  toggle_hidden()
  {
    if (this.container.style.opacity > 0.001)
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
