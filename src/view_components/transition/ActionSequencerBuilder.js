import ActionSequencer from '../../action_sequencer/ActionSequencer';
import NumberInterpolator from '../../action_sequencer/NumberInterpolator';

export default class ActionSequencerBuilder
{
  constructor()
  {

  }

  from_animation_sheet(tracks, current_context)
  {
    let sequencer = new ActionSequencer(current_context);

    for (let i = 0; i < tracks.length; i++)
    {
      let t = tracks[i];
      let interpolator = new NumberInterpolator(t.attribute_name, current_context[t.attribute_name], t.to_value, t.easing_function);
      sequencer.add_action_interpolator(t.from_time, t.to_time, interpolator);
    }

    return sequencer;
  }
}
