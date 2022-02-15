import ActionSequencer from '../../action_sequencer/ActionSequencer';
import NumberInterpolator from '../../action_sequencer/NumberInterpolator';
import ActionEvent from '../../action_sequencer/ActionEvent';
import DrawIOAnimationSheet from './DrawIOAnimationSheet';

export default class ActionSequencerBuilder
{
  constructor(initial_state_data)
  {
    this.initial_state_data = initial_state_data;
  }

  from_animation_sheet(animation_data, current_context, initial_context)
  {
    initial_context = initial_context || this.initial_state_data;
    const tracks = animation_data.animation_tracks;
    const triggers = animation_data.triggers;

    const initial_tracks = this.state_to_tracks(this.initial_state_data);

    for (let i = 0; i < initial_tracks.length; i++)
    {
      if (tracks.find(element => element.attribute_name === initial_tracks[i].attribute_name) === undefined)
      {
        tracks.push(initial_tracks[i]);
      }
    }

    const sequencer = new ActionSequencer(current_context);

    for (let i = 0; i < tracks.length; i++)
    {
      const t = tracks[i];
      const interpolator = new NumberInterpolator(t.attribute_name, current_context[t.attribute_name], t.to_value, t.easing_function);
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

  state_to_tracks(state)
  {
    const tracks = [];

    const keys = Object.keys(state);

    for (let i = 0; i < keys.length; i++)
    {
      tracks.push({
        attribute_name: keys[i],
        from_time: 0,
        to_time: 1,
        to_value: state[keys[i]],
        easing_function: 'ease_in_out_cubic'
      });
    }

    return tracks;
  }

  from_draw_io(xml, context)
  {
    const transition_data = (new DrawIOAnimationSheet()).parse(xml);
    const tracks = transition_data.animation_tracks;
    const triggers = transition_data.triggers;
    const sequencer = new ActionSequencer(context);

    for (let i = 0; i < tracks.length; i++)
    {
      const t = tracks[i];
      const interpolator = new NumberInterpolator(t.attribute_name, context[t.attribute_name], t.to_value, t.easing_function);
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
}
