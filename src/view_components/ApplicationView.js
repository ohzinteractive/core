import { ViewState } from './ViewState';

class ApplicationView extends ViewState
{
  constructor({ name, url, container })
  {
    super(name);

    this.container = container;
    this.url = url;
  }

  show()
  {
    this.container.classList.add('before_enter');
    this.container.classList.remove('before_exit');
    this.container.classList.remove('hidden');
  }

  on_enter()
  {
    this.container.classList.remove('before_enter');
    this.container.classList.remove('before_exit');
    this.container.classList.remove('hidden');
  }

  before_exit()
  {
    this.container.classList.add('before_exit');
    this.container.classList.remove('before_enter');
    this.container.classList.remove('hidden');
  }

  hide()
  {
    this.container.classList.add('hidden');
    this.container.classList.remove('before_enter');
    this.container.classList.remove('before_exit');
  }

  set_opacity(current_state_data)
  {
    this.container.style.opacity = current_state_data[`${this.name}_opacity`];
  }
}

export { ApplicationView };
