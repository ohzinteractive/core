
class ViewComponent
{
  constructor({ name, container })
  {
    this.name = name;
    this.container = container;

    this.hidden = true;
  }

  start()
  {
  }

  on_enter()
  {
    this.container.classList.remove('hidden');

    this.hidden = false;
  }

  update()
  {
  }

  on_exit()
  {
    this.container.classList.add('hidden');

    this.hidden = true;
  }

  set_opacity(opacity)
  {
    this.container.style.opacity = opacity;

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
}

export { ViewComponent };
