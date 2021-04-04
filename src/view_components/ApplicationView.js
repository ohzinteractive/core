import ViewManager from './ViewManager';

export default class ApplicationView
{
  constructor(name, container)
  {
    this.name = name;

    ViewManager.register_view(this);

    this.container = container;
  }

  start()
  {
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

  transition_finished()
  {

  }

  on_resize()
  {

  }
}
