import { ActionSequencerBuilder } from './ActionSequencerBuilder';

class TransitionTable
{
  default_state_data: object;
  transitions: any[];
  
  constructor()
  {
    this.transitions = [];
    this.default_state_data = {};
  }

  get(from_state_name: any, to_state_name: any, current_context: any)
  {
    for (let i = 0; i < this.transitions.length; i++)
    {
      if (this.transitions[i].from === from_state_name && this.transitions[i].to === to_state_name)
      {
        const action_sequencer = new ActionSequencerBuilder(this.default_state_data).from_animation_sheet(this.transitions[i].data, current_context);
        return action_sequencer;
      }
    }

    for (let i = 0; i < this.transitions.length; i++)
    {
      if (this.transitions[i].to === to_state_name && this.transitions[i].from === undefined)
      {
        const action_sequencer = new ActionSequencerBuilder(this.default_state_data).from_animation_sheet(this.transitions[i].data, current_context);
        return action_sequencer;
      }
    }

    console.error('TransitionTable.get no data found for: ', from_state_name, to_state_name);
    return undefined;
  }

  add_transitions(transitions: any)
  {
    for (let i = 0; i < transitions.length; i++)
    {
      this.transitions.push(transitions[i]);
    }
  }

  set_transitions(transitions: any)
  {
    this.transitions = transitions;
  }

  set_default_state_data(default_state_data: any)
  {
    this.default_state_data = default_state_data;
  }
}

export { TransitionTable };
