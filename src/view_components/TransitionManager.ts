import { TransitionTable } from './transition/TransitionTable';
import { ViewStateTransitionHandler } from './transition/ViewStateTransitionHandler';

class TransitionManager
{
  constructor()
  {
    this.transition_table = new TransitionTable();
    this.transition_handler = new ViewStateTransitionHandler(this.transition_table);
  }

  get action_sequencer()
  {
    return this.transition_handler.action_sequencer;
  }

  get current_state_data()
  {
    return this.transition_handler.current_state_data;
  }

  get_current_state()
  {
    return this.transition_handler.current_state;
  }

  go_to_state(state, skip = false)
  {
    this.transition_handler.go_to_state(state, skip);
  }

  before_update()
  {
    this.transition_handler.before_update();
  }

  update()
  {
    this.transition_handler.update();
  }

  fixed_update()
  {
    this.transition_handler.fixed_update();
  }

  add_transitions(transitions)
  {
    this.transition_table.add_transitions(transitions);
  }

  set_transitions(transitions)
  {
    this.transition_table.set_transitions(transitions);
  }

  set_state(state)
  {
    this.transition_handler.set_state(state);
  }

  set_default_state_data(default_state_data)
  {
    this.transition_table.set_default_state_data(default_state_data);
    this.transition_handler.set_default_state_data(default_state_data);
  }

  set_transitions_velocity(transitions_velocity)
  {
    this.transition_table.set_transitions_velocity(transitions_velocity);
  }
}

const transition_manager = new TransitionManager();
export { transition_manager as TransitionManager };
