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
    this.release_key(e.key);
  }

  clear()
  {
    this.ctrlz_pressed = false;
    for (let i = 0; i < this.keys.length; i++)
    {
      this.keys[i].pressed = false;
      this.keys[i].released = false;
    }
  }

  release_key(key_name)
  {
    const key = this.keys.find(key => key.key_name === key_name);
    if (key)
    {
      key.fired = false;
      key.down = false;
      key.released = true;
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

  press_key(key_name)
  {
    // for (let i = 0; i < this.keys.length; i++)
    // {
    //   if (this.keys[i].key_name === key && !this.keys[i].fired)
    //   {
    //     this.keys[i].pressed = true;
    //     this.keys[i].down = true;
    //     this.keys[i].fired = true;
    //   }
    // }
    const key = this.keys.find(key => key.key_name === key_name);
    if (key)
    {
      key.pressed = true;
      key.down = true;
      key.fired = true;
    }
  }

  is_key_pressed(key_name)
  {
    const key = this.keys.find(key => key.key_name === key_name);
    if (key)
    {
      return key.pressed;
    }
    return false;
  }

  is_key_down(key_name)
  {
    const key = this.keys.find(key => key.key_name === key_name);
    if (key)
    {
      return key.down;
    }
    return false;
  }

  is_key_released(key_name)
  {
    const key = this.keys.find(key => key.key_name === key_name);
    if (key)
    {
      return key.released;
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

    const index = this.keys.indexOf(key);
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
