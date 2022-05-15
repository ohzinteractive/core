import ResourceContainer from '../ResourceContainer';
import ViewManager from './ViewManager';
import ViewState from './ViewState';

export default class ApplicationView extends ViewState
{
  constructor({ name, url, container })
  {
    super(name);

    this.container = container;
    this.url = url;

    let transition_data = ResourceContainer.get(`${name}_data`);

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
    ViewManager.add_transitions(transitions);
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

  load_html_images()
  {
    const images = this.container.querySelectorAll('img');

    for (let i = 0; i < images.length; i++)
    {
      const image = images[i];

      if (image.dataset.src)
      {
        image.src = image.dataset.src;
      }
    }
  }

  load_html_videos()
  {
    const videos = this.container.querySelectorAll('video');

    for (let i = 0; i < videos.length; i++)
    {
      const video = videos[i];

      if (video.dataset.src)
      {
        video.src = video.dataset.src;
      }
    }
  }

  set_opacity(current_state_data)
  {
    this.container.style.opacity = current_state_data[`${this.name}_opacity`];
  }
}
