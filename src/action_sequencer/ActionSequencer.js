
import { Math as TMath } from 'three';

export default class ActionSequencer
{
  constructor(context)
  {
    this.elapsed_time = -0.00001;

    this.playing = false;

    this.action_events = [];
    this.action_interpolators = [];
    this.context = context;

    this.tmp_t = 0;
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

  update(delta_time)
  {
    if (this.playing)
    {
      this.elapsed_time = this.elapsed_time + delta_time;
      this.__play_clips(this.elapsed_time, this.elapsed_time + delta_time);
    }
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

  add_action_interpolator(from, to, action)
  {
    this.action_interpolators.push({
      from: from,
      to: to,
      action: action
    });
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

    for (let i = 0; i < this.action_interpolators.length; i++)
    {
      if (this.elapsed_time >= this.action_interpolators[i].from)
      {
        this.tmp_t = this.__linear_map_01(this.elapsed_time, this.action_interpolators[i].from, this.action_interpolators[i].to);
        this.tmp_t = TMath.clamp(this.tmp_t, 0, 1);
        this.action_interpolators[i].action.update(this.context, this.tmp_t);
      }
    }
  }

  __linear_map_01(value,
    from_range_start_value,
    from_range_end_value)
  {
    return ((value - from_range_start_value) / (from_range_end_value - from_range_start_value)) * (1 - 0) + 0;
  }

  get_duration()
  {
    let max_duration = 0;

    for (let i = 0; i < this.action_events.length; i++)
    {
      max_duration = Math.max(max_duration, this.action_events[i].to);
    }

    for (let i = 0; i < this.action_interpolators.length; i++)
    {
      max_duration = Math.max(max_duration, this.action_interpolators[i].to);
    }

    return max_duration;
  }
}
