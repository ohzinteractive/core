// import { TransitionManager } from 'ohzi-core';
// import { Sections } from '../Sections';
import type { ActionSequencer } from 'ohzi-core';
import { CommonTransitionController } from '../common/CommonTransitionController';

export class TemplateTransitionController extends CommonTransitionController
{
  start()
  {
    super.start();

    // __CUSTOM_TRANSITIONS__
  }

  before_enter()
  {
    super.before_enter();

    // Example of overriding initial state data
    // TransitionManager.current_state_data.home_opacity = 1;
  }

  on_enter()
  {
    super.on_enter();
  }

  update_enter_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer)
  {
    super.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer)
  {
    super.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}
