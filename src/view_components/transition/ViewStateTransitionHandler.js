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

  go_to_state(state)
  {
    if (!this.transitioning)
    {
      this.current_state.on_exit();
    }

    this.last_state = this.current_state;
    this.current_state = state;

    this.current_state.show();

    this.action_sequencer = this.transition_table.get(this.current_state.name, this.current_state_data);
    this.action_sequencer.play();

    this.transitioning = true;
  }

  update()
  {
    if (this.transitioning)
    {
      this.action_sequencer.update(Time.delta_time);

      if (this.action_sequencer.is_finished())
      {
        this.transitioning = false;

        this.last_state.hide();
        this.current_state.on_enter();
      }
    }

    this.current_state.update(this.current_state_data, this.action_sequencer.get_progress());
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
}
