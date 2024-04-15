import { CommonView } from '../common/CommonView';
import { Sections, SectionsURLs } from '../Sections';

import { TemplateSceneController } from './TemplateSceneController';
import { TemplateTransitionController } from './TemplateTransitionController';

class TemplateView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE,
      url: SectionsURLs.TEMPLATE,
      container: document.querySelector('.template')
    });

    this.scene_controller = new TemplateSceneController();
    this.transition_controller = new TemplateTransitionController();
  }

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

  before_enter()
  {
    this.scene_controller.before_enter();
    this.transition_controller.before_enter();
  }

  on_enter()
  {
    super.on_enter();

    this.scene_controller.on_enter();
    this.transition_controller.on_enter();
  }

  before_exit()
  {
    super.before_exit();

    this.scene_controller.before_exit();
    this.transition_controller.before_exit();
  }

  on_exit()
  {
    this.scene_controller.on_exit();
    this.transition_controller.on_exit();
  }

  update()
  {
    this.scene_controller.update();
    this.transition_controller.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
    this.transition_controller.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}

export { TemplateView };
