import ResourceContainer from '../ResourceContainer';
import DrawIOAnimationSheet from './transition/DrawIOAnimationSheet';
import ViewManager from './ViewManager';
import ViewState from './ViewState';

export default class ApplicationView extends ViewState
{
  constructor({ name, url, container })
  {
    super(name);

    this.container = container;
    this.url = url;

    let transitions = [
      {
        to: name,
        data: new DrawIOAnimationSheet().parse(ResourceContainer.get(`${name}_data`))
      }
    ];

    ViewManager.register_view(this);
    ViewManager.add_transitions(transitions);
  }

  show()
  {
    this.container.classList.remove('hidden');
  }

  before_exit()
  {
    this.container.classList.add('hidding');
  }

  hide()
  {
    this.container.classList.add('hidden');
    this.container.classList.remove('hidding');
  }

  set_opacity(opacity)
  {
    this.container.style.opacity = opacity;
  }
}
