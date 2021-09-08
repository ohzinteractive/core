import ViewComponentManager from './ViewComponentManager';

export default class ViewComponent
{
  constructor({ name, container })
  {
    this.name = name;
    this.container = container;

    ViewComponentManager.register_component(this);
  }

  start()
  {
  }

  on_enter()
  {
    this.container.classList.remove('hidden');
    ViewComponentManager.enable_component(this);
  }

  update()
  {
  }

  on_exit()
  {
    this.container.classList.add('hidden');
    ViewComponentManager.disable_component(this);
  }

  set_opacity(opacity)
  {
    this.container.style.opacity = opacity;
  }
}
