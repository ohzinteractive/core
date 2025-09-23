// import { TransitionManager } from 'ohzi-core';
import { SectionTransitionController } from '../common/SectionTransitionController';

class TemplateTransitionController extends SectionTransitionController
{
  before_enter()
  {
    super.before_enter();

    // Example of overriding initial state data
    // TransitionManager.current_state_data.home_opacity = 1;
  }
}

export { TemplateTransitionController };
