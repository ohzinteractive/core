import { ActionEvent } from '../../action_sequencer/ActionEvent';
import { ActionSequencer } from '../../action_sequencer/ActionSequencer';
import { NumberInterpolator } from '../../action_sequencer/NumberInterpolator';
import { DrawIOAnimationSheet } from './DrawIOAnimationSheet';

class ActionSequencerBuilder
{
  default_state_data: object;

  constructor(default_state_data: object)
  {
    this.default_state_data = default_state_data;
  }

  from_animation_sheet(animation_data: any, current_context: any, initial_context?: any)
  {
    initial_context = initial_context || this.default_state_data;
    const tracks = animation_data.animation_tracks;
    const triggers = animation_data.triggers;

    const initial_tracks = this.state_to_tracks(this.default_state_data, this.get_longest_time(animation_data.animation_tracks));

    for (let i = 0; i < initial_tracks.length; i++)
    {
      if (tracks.find((element: any) => element.attribute_name === initial_tracks[i].attribute_name) === undefined)
      {
        tracks.push(initial_tracks[i]);
      }
    }

    const sequencer = new ActionSequencer(current_context);

    for (let i = 0; i < tracks.length; i++)
    {
      const t = tracks[i];
      const interpolator = new NumberInterpolator(
        t.attribute_name,
        current_context[t.attribute_name],
        t.to_value,
        t.initial,
        t.easing_function
      );

      sequencer.add_action_interpolator(t.from_time, t.to_time, interpolator, true);
    }

    for (let i = 0; i < triggers.length; i++)
    {
      const t = triggers[i];
      const action_event = new ActionEvent(t.name, t.method, t.args);
      sequencer.add_action_event(t.at_time, action_event);
    }

    return sequencer;
  }

  state_to_tracks(state: any, longest_time: number)
  {
    const tracks = [];

    const keys = Object.keys(state);

    for (let i = 0; i < keys.length; i++)
    {
      tracks.push({
        attribute_name: keys[i],
        from_time: 0,
        to_time: longest_time < 1 ? longest_time : 1,
        to_value: state[keys[i]],
        initial: true,
        easing_function: 'ease_in_out_cubic'
      });
    }

    return tracks;
  }

  from_draw_io(xml: any, context: any)
  {
    const transition_data = (new DrawIOAnimationSheet()).parse(xml);
    const tracks = transition_data.animation_tracks;
    const triggers = transition_data.triggers;
    const sequencer = new ActionSequencer(context);

    for (let i = 0; i < tracks.length; i++)
    {
      const t = tracks[i];
      const interpolator = new NumberInterpolator(
        t.attribute_name,
        context[t.attribute_name],
        t.to_value,
        false,
        t.easing_function
      );

      sequencer.add_action_interpolator(t.from_time, t.to_time, interpolator, true);
    }

    for (let i = 0; i < triggers.length; i++)
    {
      const t = triggers[i];
      const action_event = new ActionEvent(t.name, t.method);
      sequencer.add_action_event(t.at_time, action_event);
    }

    return sequencer;
  }

  get_longest_time(tracks: any)
  {
    let longest_time = -1;

    for (let i = 0; i < tracks.length; i++)
    {
      const track = tracks[i];

      const track_time = track.to_time;

      longest_time = track_time > longest_time ? track_time : longest_time;
    }

    return longest_time;
  }
}

export { ActionSequencerBuilder };
