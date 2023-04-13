import { ViewComponent } from 'ohzi-core';
import { Components } from '../Components';

import { TemplateSceneController } from './TemplateSceneController';

class TemplateComponent extends ViewComponent
{
  constructor()
  {
    super({
      name: Components.TEMPLATE,
      container: document.querySelector('.template')
    });

    this.scene = new TemplateSceneController();
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene.start();
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
    super.on_enter();
    this.scene.on_enter();
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
    super.on_exit();
    this.scene.on_exit();
  }

  // This method is called in every frame right after on_enter is called.
  update(current_state_data)
  {
    super.update();

    this.scene.update();
  }
}

export { TemplateComponent };
