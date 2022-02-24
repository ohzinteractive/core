import Time from '../../Time';
import ViewState from '../ViewState';

export default class ViewStateTransitionHandler
{
  constructor(transition_table)
  {
    this.last_state = new ViewState();
    this.current_state = new ViewState();

    this.initial_state_data = {};
    this.current_state_data = {};

    this.transition_table = transition_table;

    this.transitioning = false;
  }

  go_to_state(state, skip = false)
  {
    if (this.transitioning)
    {
      this.__exit_last_state();
    }

    this.last_state = this.current_state;
    this.current_state = state;

    this.last_state.before_exit();
    this.current_state.show();

    this.action_sequencer = this.transition_table.get(this.last_state.name, this.current_state.name, this.current_state_data);
    this.current_state.before_enter();

    this.action_sequencer.play();

    this.transitioning = true;

    if (skip)
    {
      this.action_sequencer.skip();
      this.update();
    }
  }

  update()
  {
    if (this.transitioning)
    {
      this.__update_transitions();

      if (this.action_sequencer.is_finished())
      {
        this.transitioning = false;

        this.__update_transitions();

        this.__exit_last_state();

        this.current_state.on_enter();
      }
    }
    else
    {
      this.current_state.update();
    }
  }

  set_state(state)
  {
    this.current_state = state;
  }

  set_initial_state_data(initial_state_data)
  {
    Object.assign(this.initial_state_data, initial_state_data);
    Object.assign(this.current_state_data, initial_state_data);
  }

  __update_transitions()
  {
    this.action_sequencer.update(Time.delta_time);
    this.last_state.update_exit_transition(this.current_state_data, this.action_sequencer.get_progress(), this.action_sequencer);
    this.current_state.update_enter_transition(this.current_state_data, this.action_sequencer.get_progress(), this.action_sequencer);
  }

  __exit_last_state()
  {
    if (this.last_state.name !== this.current_state.name)
    {
      this.last_state.hide();
    }

    this.last_state.on_exit();
  }
}
