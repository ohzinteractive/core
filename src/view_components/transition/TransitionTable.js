import ActionSequencerBuilder from './ActionSequencerBuilder';

export default class TransitionTable
{
  constructor()
  {
    this.transitions = [];
    this.initial_state_data = {};
  }

  get(from_state_name, to_state_name, current_context)
  {
    for (let i = 0; i < this.transitions.length; i++)
    {
      if (this.transitions[i].from === from_state_name && this.transitions[i].to === to_state_name)
      {
        const action_sequencer = new ActionSequencerBuilder(this.initial_state_data).from_animation_sheet(this.transitions[i].data, current_context);

        return action_sequencer;
      }
    }

    for (let i = 0; i < this.transitions.length; i++)
    {
      if (this.transitions[i].to === to_state_name)
      {
        const action_sequencer = new ActionSequencerBuilder(this.initial_state_data).from_animation_sheet(this.transitions[i].data, current_context);

        return action_sequencer;
      }
    }

    console.error('TransitionTable.get no data found for: ', from_state_name, to_state_name);
    return undefined;
  }

  add_transitions(transitions)
  {
    for (let i = 0; i < transitions.length; i++)
    {
      this.transitions.push(transitions[i]);
    }
  }

  set_transitions(transitions)
  {
    this.transitions = transitions;
  }

  set_initial_state_data(initial_state_data)
  {
    this.initial_state_data = initial_state_data;
  }
}
