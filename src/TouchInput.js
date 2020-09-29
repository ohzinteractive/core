import Time from './Time';

import { Vector2 } from 'three';

export class TouchInput
{
  constructor()
  {
    this.input = undefined;
    this.container = undefined;

    this.is_touching = false;
    this.touch_moved = false;
    this.touches = 0;

    // Gestures
    this.is_multitouch = false;
    this.tapped = false;
    this.tapped_amount = 0;

    // Pinch gesture
    this.zoom_started = false;
    // TODO: touch_zoom_delta is not working properly
    this.touch_zoom_delta = 0;
    this.initial_zoom_distance = 100;
    this.last_zoom_distance = -1;

    this.center = new Vector2();
  }

  init(input, container)
  {
    this.input = input;
    this.container = container;

    // Register touch event handlers
    this.container.addEventListener('touchstart', this.process_touchstart.bind(this), false);
    this.container.addEventListener('touchmove', this.process_touchmove.bind(this), false);
    this.container.addEventListener('touchend', this.process_touchend.bind(this), true);
    this.container.addEventListener('touchcancel', this.process_touchcancel.bind(this), false);
  }

  process_touchstart(ev)
  {
    this.touches = ev.touches.length;
    this.is_touching = true;

    this.first_touch_elapsed_time = Time.elapsed_time;
    this.__trigger_mousedown_event(ev);

    if (this.touches > 1)
    {
      this.is_multitouch = true;
    }
  }

  process_touchmove(ev)
  {
    this.touch_moved = true;

    if (this.touches === 1)
    {
      this.__trigger_event(ev, 'mousemove');
    }

    if (this.touches === 2)
    {
      this.__process_pinch_gestures(ev);
    }
  }

  process_touchend(ev)
  {
    ev.preventDefault();
    this.touches = ev.touches.length;

    this.__trigger_mouseup_event(ev);

    if (this.touches === 0)
    {
      if (this.__is_a_tap())
      {
        this.tapped = true;

        this.tapped_amount++;

        this.__trigger_event(ev, 'click');

        if (this.__is_double_tap())
        {
          this.__trigger_event(ev, 'dblclick');
          this.tapped_amount = 0;
        }

        this.last_tap_elapsed_time = Time.elapsed_time;
      }

      this.is_touching = false;
      this.touch_moved = false;
      this.is_multitouch = false;
      this.zoom_started = false;
    }

    if (this.touches === 1 ||
       (this.touches === 0 && ev.changedTouches.length === 2))
    {
      this.__trigger_event(ev, 'contextmenu');
    }
  }

  process_touchcancel(ev)
  {
    console.log('touch cancel', ev);
    this.clear();
  }

  __trigger_mousedown_event(ev)
  {
    // Emulate left mouse button down
    // See Input.on_mouse_down for param references
    if (this.touches === 1)
    {
      this.__trigger_event(ev, 'mousedown', 1);
    }

    // Emulate right mouse button down
    // See Input.on_mouse_down for param references
    if (this.touches === 2)
    {
      this.__trigger_event(ev, 'mousedown', 3);
    }

    // Emulate middle mouse button down
    // See Input.on_mouse_down for param references
    if (this.touches === 3)
    {
      this.__trigger_event(ev, 'mousedown', 2);
    }
  }

  __trigger_mouseup_event(ev)
  {
    // Emulate left mouse button down
    // See Input.on_mouse_up for param references
    if (this.touches === 0)
    {
      this.__trigger_event(ev, 'mouseup', 1);
    }

    // Emulate right mouse button down
    // See Input.on_mouse_up for param references
    if (this.touches === 1)
    {
      this.__trigger_event(ev, 'mouseup', 3);
    }

    // Emulate middle mouse button down
    // See Input.on_mouse_up for param references
    if (this.touches === 2)
    {
      this.__trigger_event(ev, 'mouseup', 2);
    }
  }

  __process_pinch_gestures(ev)
  {
    // Calculate the distance between the two pointers
    let current_diff = Math.abs(ev.touches[0].clientX - ev.touches[1].clientX);

    if (this.last_zoom_distance > 0)
    {
      // Pinch Out
      // The distance between the two pointers has increased
      if (current_diff > this.last_zoom_distance)
      {
        // console.log('Pinch moving OUT -> Zoom in', ev);
      }

      // Pinch In
      // The distance between the two pointers has decreased
      if (current_diff < this.last_zoom_distance)
      {
        // console.log('Pinch moving IN -> Zoom out', ev);
      }
    }

    if (!this.zoom_started)
    {
      this.zoom_started = true;
      this.touch_zoom_delta = 0;
      this.initial_zoom_distance = this.last_zoom_distance;
    }

    let center_x = (ev.touches[0].clientX + ev.touches[1].clientX) / 2;
    let center_y = (ev.touches[0].clientY + ev.touches[1].clientY) / 2;

    this.center.set(center_x, center_y);

    this.touch_zoom_delta = current_diff - this.last_zoom_distance;

    this.last_zoom_distance = current_diff;
  }

  __trigger_event(ev, type, which)
  {
    // ev.touches are the current touches on the screen and didn't change
    // ev.changeTouches are the ones that are left the screen or change their position

    let event = new Event(type, { bubbles: true });

    let current_touches_x = 0;
    let current_touches_y = 0;

    for (let i = 0; i < ev.touches.length; i++)
    {
      const touch = ev.touches[i];

      current_touches_x += touch.clientX;
      current_touches_y += touch.clientY;
    }

    event.clientX = (ev.changedTouches[0].clientX + current_touches_x) / (ev.touches.length + 1);
    event.clientY = (ev.changedTouches[0].clientY + current_touches_y) / (ev.touches.length + 1);
    event.which = which || ev.which;

    this.center.set(event.clientX, event.clientY);

    let target_element =  document.elementFromPoint(event.clientX, event.clientY);
    target_element.dispatchEvent(event);
  }

  __is_a_tap()
  {
    return (!this.is_multitouch && !this.touch_moved && (Time.elapsed_time - this.first_touch_elapsed_time) < 0.4);
  }

  __is_double_tap()
  {
    return (this.tapped_amount > 1 && (Time.elapsed_time - this.last_tap_elapsed_time) < 0.4);
  }

  clear()
  {
    this.tapped = false;
  }
}

export default new TouchInput();
