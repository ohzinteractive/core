import ViewComponentManager from './ViewComponentManager';

export default class ViewComponent
{
  constructor(name)
  {
    this.name = name;
    this.container = undefined;

    ViewComponentManager.register_component(this);
  }

  start(container)
  {
    this.container = container;
  }

  on_enter()
  {
    this.container.classList.remove('hidden');
  }

  update()
  {
  }

  on_exit()
  {
    this.container.classList.add('hidden');
  }

  set_opacity(opacity)
  {
    this.container.style.opacity = opacity;
  }
}
