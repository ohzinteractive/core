// @ts-check
class KeyboardInput
{
  /**
   * @param {HTMLElement} container
   */
  init(container)
  {
    this.ctrlz_pressed = false;
    this.ctrlz_fired = false;

    /**
     * @type {{[key:string]:{key_name: string, pressed: boolean, down: boolean, fired: boolean, released: boolean}}}
     */
    this.keys = {};
    /** @type {string[]} */
    this.keys_keys = [];
    this.container = container;

    this.container.addEventListener('keydown', this.on_key_down.bind(this), false);
    this.container.addEventListener('keyup', this.on_key_up.bind(this), false);
  }

  /**
   * @param {KeyboardEvent} e
   */
  on_key_down(e)
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

  /**
   * @param {KeyboardEvent} e
   */
  on_key_up(e)
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

  /**
   * @param {string} key_name
   */
  release_key(key_name)
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

  /**
   * @param {string} key_name
   */
  press_key(key_name)
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

  /**
   * @param {string} key_name
   * @returns {boolean}
   */
  is_key_pressed(key_name)
  {
    const key = this.keys[key_name];
    if (key)
    {
      return key.pressed;
    }
    return false;
  }

  /**
   * @param {string} key_name
   * @returns {boolean}
   */
  is_key_down(key_name)
  {
    const key = this.keys[key_name];
    if (key)
    {
      return key.down;
    }
    return false;
  }

  /**
   * @param {string} key_name
   * @returns {boolean}
   */
  is_key_released(key_name)
  {
    const key = this.keys[key_name];
    if (key)
    {
      return key.released;
    }

    return false;
  }

  /**
   * @param {string} key
   */
  register_key(key)
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

  /**
   * @param {string} key_name
   */
  unregister_key(key_name)
  {
    delete this.keys[key_name];
  }

  dispose()
  {
    this.container.removeEventListener('keydown', this.on_key_down.bind(this), false);
    this.container.removeEventListener('keyup', this.on_key_up.bind(this), false);
  }
}

export { KeyboardInput };
