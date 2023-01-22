import { HTMLUtilities } from '../utilities/HTMLUtilities';
import { ViewComponentManager } from './ViewComponentManager';

class ViewComponent
{
  constructor({ name, container })
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

  set_opacity(current_state_data)
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

  load_html_images()
  {
    HTMLUtilities.load_images(this.container);
  }

  load_html_videos()
  {
    HTMLUtilities.load_videos(this.container);
  }
}

export { ViewComponent };
