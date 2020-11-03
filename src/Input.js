import Screen from './Screen';
import Time from './Time';
import Validation from './utilities/Validation';

import KeyboardInput from './KeyboardInput';
import TouchInput from './TouchInput';
import OS from './OS';

import { Math as TMath } from 'three';
import { Vector2 } from 'three';

class Input
{
  constructor()
  {
    this.mouse_pos = new Vector2();
    this.mouse_dir = new Vector2();

    this.__clicked_time = 0;
    this.__elapsed_time = 0;
    this.__delta_time = 0;

    this._normalized_mouse_pos = new Vector2(0, 0);

    this.left_mouse_button_down = false;
    this.left_mouse_button_pressed = false;
    this.left_mouse_button_released = false;

    this.middle_mouse_button_down = false;
    this.middle_mouse_button_pressed = false;
    this.middle_mouse_button_released = false;

    this.right_mouse_button_down = false;
    this.right_mouse_button_pressed = false;
    this.right_mouse_button_released = false;

    this.wheel_delta = 0;

    this.pinching_with_trackpad = false;
    this.scrolling_with_trackpad = false;
    this.scrolling_with_mouse = false;

    this.single_click = false;
    this.double_click = false;

    this.canvas = undefined;

    this.previous_pos_x = 0;
    this.previous_pos_y = 0;

    this.should_prevent_default_on_mouse_wheel = false;
  }

  init(container, canvas)
  {
    this.canvas = canvas;

    KeyboardInput.init();
    TouchInput.init(this, container);

    container.addEventListener('mousedown', this.on_mouse_down.bind(this));
    container.addEventListener('mousemove', this.on_mouse_move.bind(this));
    container.addEventListener('mouseup', this.on_mouse_up.bind(this));

    container.addEventListener('click', this.on_mouse_click.bind(this));
    container.addEventListener('dblclick', this.on_double_click.bind(this));
    container.addEventListener('mouseleave', this.on_focus_lost.bind(this));

    container.addEventListener('wheel', this.on_mouse_wheel.bind(this));

    // container.addEventListener('contextmenu', (event) =>
    // {
    //   event.preventDefault();
    // }, false);
  }

  get normalized_mouse_pos()
  {
    return this.calculate_normalized_mouse_pos();
  }

  get uNDC()
  {
    return this.calculate_normalized_mouse_pos();
  }

  get NDC()
  {
    this.calculate_normalized_mouse_pos();
    this._normalized_mouse_pos.x = TMath.clamp(this._normalized_mouse_pos.x, -1, 1);
    this._normalized_mouse_pos.y = TMath.clamp(this._normalized_mouse_pos.y, -1, 1);
    return this._normalized_mouse_pos;
  }

  calculate_normalized_mouse_pos()
  {
    this._normalized_mouse_pos.x = ((this.mouse_pos.x - Screen.position.x) / Screen.width) * 2.0 - 1;
    this._normalized_mouse_pos.y = -1 * (((this.mouse_pos.y - Screen.position.y) / Screen.height) * 2.0 - 1);
    return this._normalized_mouse_pos;
  }

  on_mouse_click(ev)
  {
    this.single_click = true;
  }

  on_double_click(event)
  {
    this.double_click = true;
  }

  on_mouse_wheel(event)
  {
    if (this.should_prevent_default_on_mouse_wheel)
    {
      event.preventDefault();
    }

    this.mouse_pos.x = event.clientX;
    this.mouse_pos.y = event.clientY;

    // User is using a mac
    if (OS.is_mac)
    {
      // User is pinching
      if (event.ctrlKey)
      {
        // Negative values means pinch in.
        // Positive values means pinch out.
        console.log('Pinching with a touchpad', event.deltaY);
        this.pinching_with_trackpad = true;
        this.scrolling_with_trackpad = false;
        this.scrolling_with_mouse = false;
        // User is scrolling
      }
      else
      {
        // User is using the touchpad
        if (Validation.is_int(event.deltaY))
        {
          // Negative values means scroll up
          // Positive values means scroll down
          // console.log("Scrolling with a touchpad", (event.deltaY))
          // 350 is aprox the maximum value of deltaY on touchpad scroll
          this.pinching_with_trackpad = false;
          this.scrolling_with_trackpad = true;
          this.scrolling_with_mouse = false;

          this.wheel_delta = TMath.clamp(event.deltaY / 350, -1, 1) * -1;
        }
        else
        {
          // Negative values means scroll up
          // Positive values means scroll down
          // console.log("Scrolling with a mouse", event.deltaY)
          this.pinching_with_trackpad = false;
          this.scrolling_with_trackpad = false;
          this.scrolling_with_mouse = true;

          this.wheel_delta = event.deltaY / Math.abs(event.deltaY);
        }
      }
    }
    else
    {
      // probably windows
      this.pinching_with_trackpad = false;
      this.scrolling_with_trackpad = false;
      this.scrolling_with_mouse = true;

      if (Math.abs(event.deltaY) < 0.0001)
      {
        this.wheel_delta = 0;
      }
      else
      {
        this.wheel_delta = event.deltaY / Math.abs(event.deltaY);
      }
    }
  }

  on_mouse_down(ev)
  {
    this.mouse_pos.x = ev.clientX;
    this.mouse_pos.y = ev.clientY;

    this.mouse_dir.x = 0;
    this.mouse_dir.y = 0;

    this.__clicked_time = this.__elapsed_time;

    switch (ev.which)
    {
    case 1:
      this.left_mouse_button_down = true;
      this.left_mouse_button_pressed = true;
      break;
    case 2:
      this.middle_mouse_button_down = true;
      this.middle_mouse_button_pressed = true;
      break;
    case 3:
      this.right_mouse_button_down = true;
      this.right_mouse_button_pressed = true;
      break;
    }

    this.wheel_delta = 0;
  }

  mouse_clicked()
  {
    return this.single_click;
  }

  on_mouse_up(ev)
  {
    this.mouse_dir.x = 0;
    this.mouse_dir.y = 0;
    this.wheel_delta = 0;

    this.left_mouse_button_down = false;
    this.middle_mouse_button_down = false;
    this.right_mouse_button_down = false;

    if (ev)
    {
      switch (ev.which)
      {
      case 1:
        this.left_mouse_button_released = true;
        break;
      case 2:
        this.middle_mouse_button_released = true;
        break;
      case 3:
        this.right_mouse_button_released = true;
        break;
      }
    }
  }

  on_focus_lost()
  {
    if (this.left_mouse_button_down)
    {
      this.on_mouse_up({ which: 1 });
    }

    if (this.middle_mouse_button_down)
    {
      this.on_mouse_up({ which: 2 });
    }

    if (this.right_mouse_button_down)
    {
      this.on_mouse_up({ which: 3 });
    }
  }

  time_since_last_mouse_down()
  {
    return this.__elapsed_time - this.__clicked_time;
  }

  on_mouse_move(event)
  {
    this.mouse_pos.x = event.clientX;
    this.mouse_pos.y = event.clientY;

    this.mouse_dir.set(this.mouse_pos.x - this.previous_pos_x,
      this.mouse_pos.x - this.previous_pos_y);

    this.mouse_dir.normalize();

    this.previous_pos_x = this.mouse_pos.x;
    this.previous_pos_y = this.mouse_pos.x;

    this.scrolling_with_mouse = false;
    this.scrolling_with_trackpad = false;
    this.pinching_with_trackpad = false;
  }

  mouse_is_within_bounds(rect)
  {
    rect = rect || this.canvas.getBoundingClientRect();

    return this.mouse_pos.x > rect.left &&
           this.mouse_pos.x < rect.left + rect.width &&
           this.mouse_pos.y > rect.top &&
           this.mouse_pos.y < rect.top + rect.height;
  }

  clear()
  {
    this.__elapsed_time = Time.elapsed_time;
    this.__delta_time = Time.delta_time;

    this.wheel_delta = 0;

    this.single_click = false;
    this.double_click = false;

    this.mouse_dir.multiplyScalar(0);
    this.left_mouse_button_pressed = false;
    this.left_mouse_button_released = false;

    this.middle_mouse_button_pressed = false;
    this.middle_mouse_button_released = false;

    this.right_mouse_button_pressed = false;
    this.right_mouse_button_released = false;

    KeyboardInput.clear();
    TouchInput.clear();
  }
}

export default new Input();
