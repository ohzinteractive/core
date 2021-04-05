import ActionSequencer from '../../action_sequencer/ActionSequencer';
import NumberInterpolator from '../../action_sequencer/NumberInterpolator';

export default class ActionSequencerBuilder
{
  constructor(initial_state_data)
  {
    this.initial_state_data = initial_state_data;
  }

  from_animation_sheet(tracks, current_context)
  {
    let initial_tracks = this.state_to_tracks(this.initial_state_data);

    for (let i = 0; i < initial_tracks.length; i++)
    {
      if (tracks.find(element => element.attribute_name === initial_tracks[i].attribute_name) === undefined)
      {
        tracks.push(initial_tracks[i]);
      }
    }

    let sequencer = new ActionSequencer(current_context);

    for (let i = 0; i < tracks.length; i++)
    {
      let t = tracks[i];
      let interpolator = new NumberInterpolator(t.attribute_name, current_context[t.attribute_name], t.to_value, t.easing_function);
      sequencer.add_action_interpolator(t.from_time, t.to_time, interpolator, true);
    }

    return sequencer;
  }

  state_to_tracks(state)
  {
    let tracks = [];

    let keys = Object.keys(state);

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
}
