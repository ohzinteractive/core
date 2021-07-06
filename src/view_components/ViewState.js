export default class ViewState
{
  constructor(name)
  {
    this.name = name;
  }

  start()
  {
  }

  show()
  {
  }

  hide()
  {
  }

  before_enter()
  {
  }

  on_enter()
  {
  }

  update()
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

  before_exit()
  {
  }

  on_exit()
  {
  }
}
