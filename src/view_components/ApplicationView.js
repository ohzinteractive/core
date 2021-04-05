import ViewManager from './ViewManager';
import ViewState from './ViewState';

export default class ApplicationView extends ViewState
{
  constructor({ name, container })
  {
    super(name);

    ViewManager.register_view(this);

    this.container = container;
  }

  show()
  {
    this.container.classList.remove('hidden');
  }

  hide()
  {
    this.container.classList.add('hidden');
  }

  set_opacity(opacity)
  {
    this.container.style.opacity = opacity;
  }
}
