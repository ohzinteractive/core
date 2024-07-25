class ViewState
{
  constructor(name)
  {
    this.name = name;
  }

  start()
  {
  }

  before_enter()
  {
  }

  on_enter()
  {
  }

  before_exit()
  {
  }

  on_exit()
  {
  }

  before_update()
  {
  }

  update()
  {
  }

  fixed_update()
  {
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    // Backward compatibility. It will be removed in future releases.
    this.update_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }

  // Deprecated
  update_transition(global_view_data, transition_progress, action_sequencer)
  {
  }
}

export { ViewState };
