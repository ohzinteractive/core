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

  show()
  {
    this.container.classList.remove('hidden');
  }

  hide()
  {
    this.container.classList.add('hidden');
  }

  on_enter()
  {
  }

  update()
  {
  }

  on_exit()
  {
  }

  set_opacity(opacity)
  {
    this.container.style.opacity = opacity;
  }
}
