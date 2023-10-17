import { SceneManager, VCManager } from 'ohzi-core';
import { Sections } from '../Sections';
// import { TemplateScene } from '../../scenes/TemplateScene';

class TemplateSceneController
{
  constructor()
  {
  }

  start()
  {
    // Use this line to reuse HomeScene
    this.scene = VCManager.get(Sections.HOME).scene;

    // Use this line to use own scene
    // this.scene = new TemplateScene();
  }

  before_enter()
  {
    this.scene.setup_camera();

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
