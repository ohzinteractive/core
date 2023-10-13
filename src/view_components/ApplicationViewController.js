import { TransitionManager } from './TransitionManager';
import { ViewControllerManager } from './ViewControllerManager';
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

    this.current_opacity = 0;

    ViewControllerManager.register_view_controller(this);
    TransitionManager.add_transitions(transitions);
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

  on_exit()
  {
    WorkerToMain.push(`${this.name}_view.on_exit`);
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
    const opacity = current_state_data[`${this.name}_opacity`];

    if (this.current_opacity > opacity || this.current_opacity < opacity)
    {
      this.current_opacity = opacity;

      WorkerToMain.push(`${this.name}_view.set_opacity`, [opacity]);
    }
  }
}

export { ApplicationViewController };
