import { CommonView } from '../common/CommonView';
import { Sections, SectionsURLs } from '../Sections';

import { TemplateSceneController } from './TemplateSceneController';
import { TemplateTransitionController } from './TemplateTransitionController';

import template_data from '../../../data/transitions/template.json';

class TemplateView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE,
      url: SectionsURLs.TEMPLATE,
      container: document.querySelector('.template'),
      transition_data: template_data
    });

    this.scene_controller = new TemplateSceneController();
    this.transition_controller = new TemplateTransitionController();
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene_controller.start();
    this.transition_controller.start();
  }

  show()
  {
    super.show();

    this.transition_controller.show();
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    this.scene_controller.before_enter();
    this.transition_controller.before_enter();
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
    super.before_exit();

    this.scene_controller.before_exit();
    this.transition_controller.before_exit();
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
    this.scene_controller.on_exit();
    this.transition_controller.on_exit();
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
    this.scene_controller.update();
    this.transition_controller.update();
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}

export { TemplateView };
