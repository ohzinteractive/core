import { OMath } from '../utilities/OMath';
import { ActionEvent } from './ActionEvent';
import { ActionInterpolator } from './ActionInterpolator';

class ActionSequencer
{
  action_events: any;
  channels: any;
  context: any;
  duration: any;
  elapsed_time: any;
  initial_context: any;
  playback_speed: any;
  playing: any;
  previous_elapsed_time: any;
  tmp_t: any;
  /**
   * @param {any} [context]
   */
  constructor(context = {})
  {
    this.previous_elapsed_time = -0.00001;
    this.elapsed_time = -0.00001;
    this.playback_speed = this.__get_playback_speed();
    this.playing = true;

    /** @type {{action:ActionEvent, trigger_time:number }[]} */
    this.action_events = [];
    this.context = context;

    this.initial_context = JSON.parse(JSON.stringify(context));

    this.tmp_t = 0;

    /** @type {{[key:string]:any[]}} */
    this.channels = {};

    const channel_names = Object.keys(context);
    for (let i = 0; i < channel_names.length; i++)
    {
      this.channels[channel_names[i]] = [];
    }

    this.duration = 0;
  }

  play()
  {
    this.playing = true;
  }

  stop()
  {
    this.playing = false;
  }

  reset()
  {
    this.elapsed_time = -0.00001;
  }

  skip()
  {
    const duration = this.get_duration();
    this.__play_clips(this.elapsed_time, duration + 0.0001);
    this.elapsed_time = duration;
  }

  /**
   * @param {number} delta_time
   */
  update(delta_time: any)
  {
    if (this.playing)
    {
      this.previous_elapsed_time = this.elapsed_time;
      this.elapsed_time += delta_time * this.playback_speed;
      this.__play_clips(this.previous_elapsed_time, this.elapsed_time);
    }
  }

  /**
   * @param {number} time
   */
  set_progress(time: any)
  {
    this.previous_elapsed_time = this.elapsed_time;
    this.elapsed_time = OMath.clamp(time, 0, this.duration);
    this.__play_clips(this.elapsed_time, this.elapsed_time);
  }

  /**
   * @param {number} t
   */
  set_normalized_progress(t: any)
  {
    this.previous_elapsed_time = this.elapsed_time;
    this.elapsed_time = OMath.clamp(t, 0, 1) * this.duration;
    this.__play_clips(this.elapsed_time, this.elapsed_time);
  }

  get_progress()
  {
    return OMath.clamp(this.elapsed_time / this.get_duration(), 0, 1);
  }

  is_finished()
  {
    return this.elapsed_time > this.get_duration();
  }

  /**
   * @param {number} trigger_time
   * @param {ActionEvent} action
   */
  add_action_event(trigger_time: any, action: any)
  {
    this.action_events.push({
      trigger_time: trigger_time,
      action: action
    });

    this.duration = Math.max(this.duration, trigger_time);
  }

  /**
   * @param {number} from
   * @param {number} to
   * @param {ActionInterpolator} interpolator
   * @param {boolean} [use_dynamic_from_value]
   */
  add_action_interpolator(from: any, to: any, interpolator: any, use_dynamic_from_value = false)
  {
    if (use_dynamic_from_value)
    {
      const keyframes = this.channels[interpolator.attribute_name];

      if (keyframes === undefined)
      {
        console.error(`${interpolator.attribute_name} missing in initial state data.`);
      }

      if (keyframes.length === 0)
      {
        interpolator.from = this.initial_context[interpolator.attribute_name];
      }
      else
      {
        interpolator.from = keyframes[keyframes.length - 1].interpolator.to;
      }
    }

    const keyframe = {
      from: from,
      to: to,
      interpolator: interpolator
    };

    this.duration = Math.max(this.duration, to);
    this.channels[interpolator.attribute_name].push(keyframe);
  }

  /**
   * @param {string} name
   */
  get_current_target_value(name: any)
  {
    const keyframe = this.__get_current_keyframe(name, this.elapsed_time);

    if (this.elapsed_time < keyframe.from)
    {
      return keyframe.interpolator.evaluate(0);
    }

    return keyframe.interpolator.evaluate(1);
  }

  /**
   * @param {string} name
   */
  get_current_starting_value(name: any)
  {
    const keyframe = this.__get_current_keyframe(name, this.elapsed_time);

    return keyframe.interpolator.evaluate(0);
  }

  /**
   * @param {string} name
   */
  get_current_progress(name: any)
  {
    const keyframe = this.__get_current_keyframe(name, this.elapsed_time);
    const t = this.__linear_map_01(this.elapsed_time, keyframe.from, keyframe.to);

    return keyframe.interpolator.easing_function(t);
  }

  get_duration()
  {
    return this.duration;
  }

  /**
   * @param {number} from
   * @param {number} to
   */
  __play_clips(from: any, to: any) 
  {
    if (this.elapsed_time > this.previous_elapsed_time)
    {
      this.__play_events(this.previous_elapsed_time, this.elapsed_time);
    }
    const channel_names = Object.keys(this.initial_context);

    for (let i = 0; i < channel_names.length; i++)
    {
      const name = channel_names[i];
      const keyframe = this.__get_current_keyframe(name, from);

      this.context[name] = this.evaluate_keyframe(keyframe, from);
    }
  }

  /**
   * @param {number} from
   * @param {number} to
   */
  __play_events(from: any, to: any)
  {
    for (let i = 0; i < this.action_events.length; i++)
    {
      const trigger_time = this.action_events[i].trigger_time;
      if (OMath.between(trigger_time, from, to))
      {
        // console.log('Play event: ' + this.action_events[i].action.constructor.name + ' at ' +  this.action_events[i].trigger_time);
        this.action_events[i].action.trigger();
      }
    }
  }

  /**
   * @param {any} keyframe
   * @param {number} time
   */
  evaluate_keyframe(keyframe: any, time: any)
  {
    this.tmp_t = this.__linear_map_01(time, keyframe.from, keyframe.to);

    return keyframe.interpolator.evaluate(OMath.clamp(this.tmp_t, 0, 1));
  }

  /**
   * @param {string} channel_name
   */
  get_keyframes(channel_name: any)
  {
    return this.channels[channel_name];
  }

  /**
   * @param {string} channel_name
   */
  is_channel_redefined(channel_name: any)
  {
    for (let i = 0; i < this.channels[channel_name].length; i++)
    {
      const keyframe = this.channels[channel_name][i];

      if (keyframe.interpolator.initial)
      {
        return false;
      }
    }

    return true;
  }

  /**
   * @param {number} value
   * @param {number} from_range_start_value
   * @param {number} from_range_end_value
   * @returns {number}
   */
  __linear_map_01(value: any,
    from_range_start_value: any,
    from_range_end_value: any)
  {
    return OMath.saturate(((value - from_range_start_value) / (from_range_end_value - from_range_start_value)) * (1 - 0) + 0);
  }

  /**
   * @param {string} channel_name
   * @param {number} time
   */
  __get_current_keyframe(channel_name: any, time: any)
  {
    let current = undefined;

    const keyframes = this.channels[channel_name];

    for (let i = 0; i < keyframes.length; i++)
    {
      const keyframe = keyframes[i];

      if (time >= keyframe.from && time <= keyframe.to)
      {
        current = keyframe;
        return current;
      }
    }

    let min = Infinity;

    for (let i = 0; i < keyframes.length; i++)
    {
      const keyframe = keyframes[i];
      const distance = Math.abs(keyframe.to - time);

      if (distance < min)
      {
        current = keyframe;
        min = distance;
      }
    }

    return current;
  }

  __get_playback_speed()
  {
    const url_params = new URLSearchParams(window.location.search);

    const transitions_velocity = url_params.get('transitions_velocity');

    if (transitions_velocity)
    {
      return Number(transitions_velocity);
    }
    else
    {
      return 1;
    }
  }

  /**
   * @param {string} name
   * @param {number} value
   */
  set_initial_value_on_channel(name: any, value: any)
  {
    const keyframes = this.get_keyframes(name);
    keyframes[0].interpolator.from = value;
  }

  /**
   * @param {string} name
   * @param {number} value
   */
  set_final_value_on_channel(name: any, value: any)
  {
    const keyframes = this.get_keyframes(name);
    keyframes[keyframes.length - 1].interpolator.to = value;
  }
}

export { ActionSequencer };
