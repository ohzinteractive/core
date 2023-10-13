
class ViewManager
{
  constructor()
  {
    this.views = [];
    this.offscreen_manager = undefined;

    this.browser_title_suffix = '';
  }

  go_to_view(view_name, change_url = true, skip = false)
  {
    const v = this.get(view_name);

    if (change_url)
    {
      this.__change_browser_url(v.url);
      this.__change_browser_title(v.url);
    }

    this.offscreen_manager.post('go_to_view_controller', { view_controller_name: view_name, skip });
  }

  go_to_scene(scene_name, change_url = false, skip = false)
  {
    const transition_view = this.get('transition');

    transition_view.set_next_view_name(scene_name);

    this.go_to_view(transition_view.name, change_url, skip);
  }

  set_browser_title_suffix(title_suffix)
  {
    this.browser_title_suffix = title_suffix;
  }

  get(view_name)
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

  get_by_url(url)
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

  register_view(view)
  {
    this.views.push(view);
  }

  set_offscreen_manager(offscreen_manager)
  {
    this.offscreen_manager = offscreen_manager;
  }

  __change_browser_url(url)
  {
    window.history.pushState('', '', url);
  }

  __change_browser_title(name)
  {
    const title = this.__capitalize(name);

    document.title = title ? `${title} | ${this.browser_title_suffix}` : this.browser_title_suffix;
  }

  __capitalize(string)
  {
    let aux_string = string.toUpperCase().replace('/', '');
    aux_string = this.__snake_to_whitespace(aux_string);

    return aux_string;
  }

  __snake_to_whitespace(string)
  {
    return string.replace(
      /([-_][A-Z])/g,
      (group) => group
        .replace('-', ' ')
        .replace('_', ' ')
    );
  }
}

const view_manager = new ViewManager();
export { view_manager as ViewManager };
