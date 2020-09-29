import * as THREE from 'three';

export default class ActionSequencer
{
  constructor(duration, context)
  {
    this.elapsed_time = -0.00001;

    this.playing = false;

    this.action_events = [];
    this.action_interpolators = [];
    this.duration = duration;
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

  update(TIME)
  {
    if (this.playing)
    {
      this.__play_clips(this.elapsed_time, this.elapsed_time + TIME.delta_time());
      this.elapsed_time = this.elapsed_time + TIME.delta_time();
    }
  }

  set_duration(value)
  {
    this.duration = value;
  }

  is_finished()
  {
    return this.elapsed_time > this.duration;
  }

  add_action_event(trigger_time, action)
  {
    this.action_events.push({
      trigger_time: trigger_time,
      action: action
    });
  }

  add_action_interpolator(from, duration, action)
  {
    this.action_interpolators.push({
      from: from,
      to: from + duration,
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
        this.tmp_t = THREE.Math.clamp(this.tmp_t, 0, 1);
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
}
