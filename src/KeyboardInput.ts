class KeyboardInput
{
  container: Element | Document;
  ctrlz_fired: boolean;
  ctrlz_pressed: boolean;
  keys: {
    [key: string]: {
      key_name: string;
      pressed: boolean;
      down: boolean;
      fired: boolean;
      released: boolean;
    };
  };
  keys_keys: string[];

  init(container: Element | Document)
  {
    this.ctrlz_pressed = false;
    this.ctrlz_fired = false;

    this.keys = {};
    this.keys_keys = [];
    this.container = container;

    this.container.addEventListener('keydown', this.on_key_down, false);
    this.container.addEventListener('keyup', this.on_key_up, false);
  }

  on_key_down = (e: KeyboardEvent) =>
  {
    if (e.keyCode === 90 && e.ctrlKey && !this.ctrlz_fired)
    {
      this.ctrlz_pressed = true;
      this.ctrlz_fired = true;
    }

    if (e.code)
    {
      this.press_key(e.code);
    }
  }

  on_key_up = (e: KeyboardEvent) =>
  {
    this.release_key(e.code);
  }

  clear()
  {
    this.ctrlz_pressed = false;

    for (let i = 0; i < this.keys_keys.length; i++)
    {
      this.keys[this.keys_keys[i]].pressed = false;
      this.keys[this.keys_keys[i]].released = false;
    }
  }

  release_key(key_name: string)
  {
    const key = this.keys[key_name];
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

    for (let i = 0; i < this.keys_keys.length; i++)
    {
      this.keys[this.keys_keys[i]].fired = false;
      this.keys[this.keys_keys[i]].down = false;
    }
  }

  press_key(key_name: string)
  {
    const key = this.keys[key_name];
    if (key)
    {
      if (key.down === false)
      {
        key.pressed = true;
      }
      key.down = true;
      key.fired = true;
    }
  }

  is_key_pressed(key_name: string): boolean
  {
    const key = this.keys[key_name];
    if (key)
    {
      return key.pressed;
    }
    return false;
  }

  is_key_down(key_name: string): boolean
  {
    const key = this.keys[key_name];
    if (key)
    {
      return key.down;
    }
    return false;
  }

  is_key_released(key_name: string): boolean
  {
    const key = this.keys[key_name];
    if (key)
    {
      return key.released;
    }

    return false;
  }

  register_key(key: string)
  {
    this.keys[key] =
      {
        key_name: key,
        pressed: false,
        down: false,
        fired: false,
        released: false
      };

    this.keys_keys = Object.keys(this.keys);
  }

  unregister_key(key_name: string)
  {
    delete this.keys[key_name];
  }

  dispose()
  {
    this.container.removeEventListener('keydown', this.on_key_down, false);
    this.container.removeEventListener('keyup', this.on_key_up, false);
  }
}

export { KeyboardInput };
