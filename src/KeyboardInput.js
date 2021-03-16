class KeyboardInput
{
  init(container)
  {
    this.ctrlz_pressed = false;
    this.ctrlz_fired = false;

    this.keys = [];
    this.container = container;

    this.container.addEventListener('keydown', this.on_key_down.bind(this), false);
    this.container.addEventListener('keyup', this.on_key_up.bind(this), false);
  }

  on_key_down(e)
  {
    if (e.keyCode === 90 && e.ctrlKey && !this.ctrlz_fired)
    {
      this.ctrlz_pressed = true;
      this.ctrlz_fired = true;
    }
    if (e.key)
    {
      this.press_key(e.key);
    }
  }

  on_key_up(e)
  {
    this.release_keys();
  }

  clear()
  {
    this.ctrlz_pressed = false;
    for (let i = 0; i < this.keys.length; i++)
    {
      this.keys[i].pressed = false;
    }
  }

  release_keys()
  {
    this.ctrlz_fired = false;

    for (let i = 0; i < this.keys.length; i++)
    {
      this.keys[i].fired = false;
      this.keys[i].down = false;
    }
  }

  press_key(key)
  {
    for (let i = 0; i < this.keys.length; i++)
    {
      if (this.keys[i].key_name === key && !this.keys[i].fired)
      {
        this.keys[i].pressed = true;
        this.keys[i].down = true;
        this.keys[i].fired = true;
      }
    }
  }

  key_is_pressed(key)
  {
    for (let i = 0; i < this.keys.length; i++)
    {
      if (this.keys[i].key_name === key)
      {
        return this.keys[i].pressed;
      }
    }
    return false;
  }

  key_is_down(key)
  {
    for (let i = 0; i < this.keys.length; i++)
    {
      if (this.keys[i].key_name === key)
      {
        return this.keys[i].down;
      }
    }
    return false;
  }

  register_key(key)
  {
    this.keys.push(
      {
        key_name: key,
        pressed: false,
        down: false,
        up: false,
        fired: false

      });
  }

  unregister_key(key_name)
  {
    let key = undefined;
    for (let i = 0; i < this.keys.length; i++)
    {
      if (this.keys[i].key_name === key_name)
      {
        key = this.keys[i];
      }
    }

    let index = this.keys.indexOf(key);
    if (index > -1)
    {
      this.keys.splice(index, 1);
    }
  }

  dispose()
  {
    this.container.removeEventListener('keydown', this.on_key_down.bind(this), false);
    this.container.removeEventListener('keyup', this.on_key_up.bind(this), false);
  }
}

export default new KeyboardInput();
