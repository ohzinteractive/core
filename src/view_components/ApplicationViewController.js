import { ViewManager } from './ViewManager';
import { ViewState } from './ViewState';
import { WorkerToMain } from './WorkerToMain';

class ApplicationViewController extends ViewState
{
  constructor({ name, url, transition_data })
  {
    super(name);

    this.url = url;

    transition_data = transition_data || {
      animation_tracks: [],
      triggers: []
    };

    const transitions = [
      {
        to: name,
        data: transition_data
      }
    ];

    ViewManager.register_view(this);
    ViewManager.add_transitions(transitions);
  }

  show()
  {
    WorkerToMain.push(`${this.name}_view.show`);
  }

  before_enter()
  {
    WorkerToMain.push(`${this.name}_view.before_enter`);
  }

  on_enter()
  {
    WorkerToMain.push(`${this.name}_view.on_enter`);
  }

  before_exit()
  {
    WorkerToMain.push(`${this.name}_view.before_exit`);
  }

  hide()
  {
    WorkerToMain.push(`${this.name}_view.hide`);
  }

  update()
  {
    WorkerToMain.push(`${this.name}_view.update`);
  }

  fixed_update()
  {
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    WorkerToMain.push(`${this.name}_view.update_enter_transition`, [global_view_data, transition_progress]);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    WorkerToMain.push(`${this.name}_view.update_exit_transition`, [global_view_data, transition_progress]);
  }

  set_opacity(current_state_data)
  {
    WorkerToMain.push(`${this.name}_view.set_opacity`, [current_state_data]);
  }
}

export { ApplicationViewController };
