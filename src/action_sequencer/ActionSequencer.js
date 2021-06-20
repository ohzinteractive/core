
import { Math as TMath } from 'three';

export default class ActionSequencer
{
  constructor(context)
  {
    this.elapsed_time = -0.00001;

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
      this.elapsed_time = this.elapsed_time + delta_time;
      this.__play_clips(this.elapsed_time, this.elapsed_time + delta_time);
    }
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
  }

  add_action_interpolator(from, to, interpolator, use_dynamic_from_value = false)
  {
    if (use_dynamic_from_value)
    {
      let actions = this.channels[interpolator.attribute_name];

      if (actions === undefined)
      {
        console.error(`${interpolator.attribute_name} missing in initial state data.`);
      }

      if (actions.length === 0)
      {
        interpolator.from = this.initial_context[interpolator.attribute_name];
      }
      else
      {
        interpolator.from = actions[actions.length - 1].interpolator.to;
      }
    }

    let action = {
      from: from,
      to: to,
      interpolator: interpolator
    };

    this.duration = Math.max(this.duration, to);
    this.channels[interpolator.attribute_name].push(action);
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
        this.action_events[i].action.trigger(this.context);
      }
    }
    let channel_names = Object.keys(this.initial_context);

    for (let i = 0; i < channel_names.length; i++)
    {
      let name = channel_names[i];
      let action = this.__get_nearest_action_interpolator(name, from);
      this.context[name] = this.evaluate_action_interpolator(action, from);
    }
  }

  evaluate_action_interpolator(action_interpolator, time)
  {
    this.tmp_t = this.__linear_map_01(time, action_interpolator.from, action_interpolator.to);
    return action_interpolator.interpolator.evaluate(TMath.clamp(this.tmp_t, 0, 1));
  }

  __linear_map_01(value,
    from_range_start_value,
    from_range_end_value)
  {
    return ((value - from_range_start_value) / (from_range_end_value - from_range_start_value)) * (1 - 0) + 0;
  }

  __get_nearest_action_interpolator(channel_name, time)
  {
    let closest = undefined;
    let min_time = 9999999;
    let actions = this.channels[channel_name];
    for (let i = 0; i < actions.length; i++)
    {
      let action = actions[i];
      let difference = Math.min(
        Math.abs(action.from - time),
        Math.abs(action.to - time)
      );

      if (difference < min_time)
      {
        min_time = difference;
        closest = action;
      }
    }
    return closest;
  }
}
