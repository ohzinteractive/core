import type { ApplicationView } from './ApplicationView';
import { TransitionManager } from './TransitionManager';

class ViewManager
{
  browser_title_suffix: string;
  views: ApplicationView[];

  constructor()
  {
    this.views = [];

    this.browser_title_suffix = '';
  }

  update()
  {
    this.__set_views_opacities();
  }

  go_to_view(view_name: string, change_url = true, skip = false)
  {
    const v = this.get(view_name);

    if (change_url)
    {
      this.__change_browser_url(v.url);
      this.__change_browser_title(v.url);
    }

    TransitionManager.go_to_state(v, skip);
  }

  go_to_scene(scene_name: string, change_url = false, skip = false)
  {
    const next_view = this.get(scene_name);
    const transition_view = this.get('transition');

    transition_view.set_next_view(next_view);
    this.go_to_view(transition_view.name, change_url, skip);
  }

  register_view(view: ApplicationView)
  {
    this.views.push(view);
  }

  has_view(view_name: string)
  {
    for (let i = 0; i < this.views.length; i++)
    {
      if (this.views[i].name === view_name)
      {
        return true;
      }
    }
    return false;
  }

  set_view(view_name: string)
  {
    const view = this.get(view_name);

    TransitionManager.set_state(view);
  }

  set_browser_title_suffix(title_suffix: string)
  {
    this.browser_title_suffix = title_suffix;
  }

  get_current_view()
  {
    return TransitionManager.get_current_state();
  }

  get_view_by_name(view_name: string)
  {
    console.warn('DEPRECATED. Use ViewManager.get instead');
    this.get(view_name);
  }

  get(view_name: string)
  {
    for (let i = 0; i < this.views.length; i++)
    {
      if (this.views[i].name === view_name)
      {
        return this.views[i];
      }
    }
    console.error('[ViewManager.get] no view found for: ', view_name);
    return undefined;
  }

  get_by_url(url: string)
  {
    for (let i = 0; i < this.views.length; i++)
    {
      if (this.views[i].url === url)
      {
        return this.views[i];
      }
    }
    console.error('[ViewManager.get_by_url] no view found for: ', url);
    return undefined;
  }

  __change_browser_url(url: string)
  {
    window.history.pushState('', '', url);
  }

  __change_browser_title(name: string)
  {
    const title = this.__capitalize(name);

    document.title = title ? `${title} | ${this.browser_title_suffix}` : this.browser_title_suffix;
  }

  __set_views_opacities()
  {
    for (let i = 0; i < this.views.length; i++)
    {
      this.views[i].set_opacity(TransitionManager.current_state_data);
    }
  }

  __capitalize(string: string)
  {
    let aux_string = string.toUpperCase().replace('/', '');
    aux_string = this.__snake_to_whitespace(aux_string);

    return aux_string;
  }

  __snake_to_whitespace(string: string)
  {
    return string.replace(
      /([-_][A-Z])/g,
      (group: string) => group
        .replace('-', ' ')
        .replace('_', ' ')
    );
  }
}

const view_manager = new ViewManager();
export { view_manager as ViewManager };
