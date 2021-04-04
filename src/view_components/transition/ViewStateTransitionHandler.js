import Time from '../../Time';

export default class ViewStateTransitionHandler
{
  constructor(initial_state_data, transition_table)
  {
    this.active_states = [];

    this.target_state = undefined;
    this.current_state_data = {};

    this.initial_state_data = {};
    this.transition_table = transition_table;

    Object.assign(this.initial_state_data, initial_state_data);
    Object.assign(this.current_state_data, initial_state_data);

    this.t = 0;
    this.transitioning = false;
  }

  go_to_state(state)
  {
    if (this.is_new_state(state))
    {
      state.on_enter();
      if (this.target_state)
      {
        this.active_states.push(this.target_state);
      }

      this.active_states.push(state);
    }

    this.target_state = state;

    this.action_sequencer = this.transition_table.get(this.target_state.name, this.current_state_data);
    this.action_sequencer.play();

    this.t = 0;
    this.transitioning = true;
    this.transition_velocity = 1;
  }

  update()
  {
    if (this.transitioning)
    {
      this.t += Time.delta_time * this.transition_velocity;

      this.action_sequencer.update(Time.delta_time);

      this.update_active_states();

      if (this.t > this.action_sequencer.get_duration())
      {
        this.transitioning = false;
        this.call_exit_transition_and_cleanup();
        this.target_state.transition_finished();
      }
    }
    else
    {
      this.target_state.update(this.current_state_data);
    }
  }

  is_new_state(state)
  {
    for (let i = 0; i < this.active_states.length; i++)
    {
      if (this.active_states[i].name === state.name)
      {
        return false;
      }
    }
    return true;
  }

  remove_active_state(state)
  {
    let index = -1;

    for (let i = 0; i < this.active_states.length; i++)
    {
      if (this.active_states[i].name === state.name)
      {
        index = i;
      }
    }

    this.active_states.splice(index, 1);
  }

  call_exit_transition_and_cleanup()
  {
    while (this.active_states.length > 0)
    {
      if (this.active_states[0].name !== this.target_state.name)
      {
        this.active_states[0].on_exit();
      }
      this.active_states.shift();
    }
  }

  set_state(state)
  {
    this.target_state = state;
  }

  update_active_states()
  {
    for (let i = 0; i < this.active_states.length; i++)
    {
      this.active_states[i].update(this.current_state_data);
    }
  }
}
