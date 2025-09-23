// import { TransitionManager } from 'ohzi-core';
// import { ViewManager } from 'ohzi-core';
// import { Sections } from '../Sections';
import { SectionTransitionController } from '../common/SectionTransitionController';

export class TemplateTransitionController extends SectionTransitionController
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

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}
