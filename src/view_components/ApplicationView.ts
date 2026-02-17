import { TransitionManager } from './TransitionManager';
import { ViewManager } from './ViewManager';
import { ViewState } from './ViewState';

class ApplicationView extends ViewState
{
  container: HTMLElement;
  current_opacity: number;
  name: string;
  url: string;
  
  constructor({
    name,
    url,
    container,
    transition_data
  }: { name: string; url: string; container: HTMLElement; transition_data?: any })
  {
    super(name);

    this.container = container;
    this.url = url;

    this.current_opacity = 0;

    transition_data = transition_data || {
      animation_tracks: [],
      triggers: []
    };

    const transitions = [
      {
        to: name,
        data: transition_data
      }
    ];

    ViewManager.register_view(this);
    TransitionManager.add_transitions(transitions);
  }

  before_enter()
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

  on_exit()
  {
    this.container.classList.add('hidden');
    this.container.classList.remove('before_enter');
    this.container.classList.remove('before_exit');
  }

  set_opacity(current_state_data: any)
  {
    const opacity = current_state_data[`${this.name}_opacity`];

    if (this.current_opacity > opacity || this.current_opacity < opacity)
    {
      this.current_opacity = opacity;

      this.container.style.opacity = this.current_opacity;
    }
  }
}

export { ApplicationView };
