import ViewComponentManager from './ViewComponentManager';

export default class ViewComponent
{
  constructor()
  {
    ViewComponentManager.register_component(this);

    this.container = undefined;
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

  on_resize()
  {
  }
}
