
import { Math as TMath } from 'three';

export default class ActionSequencer
{
  constructor(context)
  {
    this.elapsed_time = -0.00001;
    this.playback_speed = 1;
    this.playing = false;

    this.action_events = [];
    this.context = context;

    this.initial_context = JSON.parse(JSON.stringify(context));

    this.tmp_t = 0;

    this.channels = {};

    let channel_names = Object.keys(context);
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
    this.elapsed_time = this.get_duration();
    this.__play_clips(this.elapsed_time, this.elapsed_time + 0.01);
  }

  update(delta_time)
  {
    if (this.playing)
    {
      this.__play_clips(this.elapsed_time, this.elapsed_time + delta_time * this.playback_speed);
      this.elapsed_time = this.elapsed_time + delta_time * this.playback_speed;
    }
  }

  set_progress(time)
  {
    this.elapsed_time = TMath.clamp(time, 0, this.duration);
    this.__play_clips(this.elapsed_time, this.elapsed_time);
  }

  set_normalized_progress(t)
  {
    this.elapsed_time = TMath.clamp(t, 0, 1) * this.duration;
    this.__play_clips(this.elapsed_time, this.elapsed_time);
  }

  get_progress()
  {
    return TMath.clamp(this.elapsed_time / this.get_duration(), 0, 1);
  }

  is_finished()
  {
    return this.elapsed_time > this.get_duration();
  }

  add_action_event(trigger_time, action)
  {
    this.action_events.push({
      trigger_time: trigger_time,
      action: action
    });

    this.duration = Math.max(this.duration, trigger_time);
  }

  add_action_interpolator(from, to, interpolator, use_dynamic_from_value = false)
  {
    if (use_dynamic_from_value)
    {
      let keyframes = this.channels[interpolator.attribute_name];

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

    let keyframe = {
      from: from,
      to: to,
      interpolator: interpolator
    };

    this.duration = Math.max(this.duration, to);
    this.channels[interpolator.attribute_name].push(keyframe);
  }

  get_property_target_value(name)
  {
    let keyframe = this.__get_nearest_keyframe(name, this.elapsed_time);

    if (this.elapsed_time < keyframe.from)
    {
      return keyframe.interpolator.evaluate(0);
    }

    return keyframe.interpolator.evaluate(1);
  }

  get_duration()
  {
    return this.duration;
  }

  __play_clips(from, to)
  {
    for (let i = 0; i < this.action_events.length; i++)
    {
      if (this.action_events[i].trigger_time >= from &&
          this.action_events[i].trigger_time < to)
      {
        // console.log("Play event: " + this.action_events[i].action.constructor.name + " at "+  this.action_events[i].trigger_time);
        this.action_events[i].action.trigger();
      }
    }
    let channel_names = Object.keys(this.initial_context);

    for (let i = 0; i < channel_names.length; i++)
    {
      let name = channel_names[i];
      let keyframe = this.__get_nearest_keyframe(name, from);
      this.context[name] = this.evaluate_keyframe(keyframe, from);
    }
  }

  evaluate_keyframe(keyframe, time)
  {
    this.tmp_t = this.__linear_map_01(time, keyframe.from, keyframe.to);
    return keyframe.interpolator.evaluate(TMath.clamp(this.tmp_t, 0, 1));
  }

  __linear_map_01(value,
    from_range_start_value,
    from_range_end_value)
  {
    return ((value - from_range_start_value) / (from_range_end_value - from_range_start_value)) * (1 - 0) + 0;
  }

  __get_nearest_keyframe(channel_name, time)
  {
    let closest = undefined;
    let min_time = 9999999;
    let keyframes = this.channels[channel_name];
    for (let i = 0; i < keyframes.length; i++)
    {
      let keyframe = keyframes[i];
      let middle_time = (keyframe.to - keyframe.from) / 2 + keyframe.from;
      let distance_to_middle_time = Math.abs(time - middle_time);

      if (distance_to_middle_time < min_time)
      {
        min_time = distance_to_middle_time;
        closest = keyframe;
      }
    }
    return closest;
  }
}
