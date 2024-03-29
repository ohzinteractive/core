import { SectionTransitionController } from '../common/SectionTransitionController';
// import { ViewManager } from 'ohzi-core';
// import { Sections } from '../Sections';

class TemplateTransitionController extends SectionTransitionController
{
  start()
  {
    super.start();

    // __CUSTOM_TRANSITIONS__
  }

  before_enter()
  {
    super.before_enter();
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

export { TemplateTransitionController };
