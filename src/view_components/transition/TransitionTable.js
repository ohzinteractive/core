import ActionSequencerBuilder from './ActionSequencerBuilder';

export default class TransitionTable
{
  constructor()
  {
    this.transitions = undefined;
  }

  get(to_state, current_context)
  {
    for (let i = 0; i < this.transitions.length; i++)
    {
      if (this.transitions[i].to === to_state)
      {
        let action_sequencer = new ActionSequencerBuilder().from_animation_sheet(this.transitions[i].data, current_context);

        return action_sequencer;
      }
    }

    console.error('TransitionTable.get no data found for: ', to_state);
    return undefined;
  }

  set_transitions(transitions)
  {
    this.transitions = transitions;
  }
}
