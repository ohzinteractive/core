import { SceneManager } from 'ohzi-core';
import { SceneController } from '../../components/SceneController';

class TemplateSceneController
{
  constructor()
  {
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene = SceneController.home_scene;
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    SceneManager.current = this.scene;
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
    this.scene.update();
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene.update();
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }
}

export { TemplateSceneController };
