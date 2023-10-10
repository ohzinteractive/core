import { SceneManager } from 'ohzi-core';
import { HomeScene } from '../../app/js/scenes/HomeScene';

class TemplateSceneController
{
  constructor()
  {
  }

  start()
  {
    this.scene = HomeScene;
  }

  before_enter()
  {
    SceneManager.current = this.scene;
  }

  on_enter()
  {
  }

  before_exit()
  {
  }

  on_exit()
  {
  }

  update()
  {
    this.scene.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene.update();
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
  }
}

export { TemplateSceneController };
