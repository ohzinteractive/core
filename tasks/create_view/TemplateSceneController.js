import { SceneManager, VCManager } from 'ohzi-core';
import { Sections } from '../Sections';

class TemplateSceneController
{
  constructor()
  {
  }

  start()
  {
    this.scene = VCManager.get(Sections.HOME).scene;
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
