import { ViewComponentManager } from './ViewComponentManager';

class ViewComponent
{
  constructor({ name, container })
  {
    this.name = name;
    this.container = container;

    // this.hidden = true;

    ViewComponentManager.register_component(this);
  }

  start()
  {
  }

  on_enter()
  {
    this.container.classList.remove('hidden');

    // this.hidden = false;

    ViewComponentManager.enable_component(this);
  }

  update()
  {
  }

  on_exit()
  {
    this.container.classList.add('hidden');

    // this.hidden = true;

    ViewComponentManager.disable_component(this);
  }

  set_opacity(opacity)
  {
    this.container.style.opacity = opacity;
  }
}

export { ViewComponent };
