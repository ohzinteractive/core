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

  start()
  {
    this.scene.start();
  }

  on_enter()
  {
    super.on_enter();
    this.scene.on_enter();
  }

  on_exit()
  {
    super.on_exit();
    this.scene.on_exit();
  }

  update(current_state_data)
  {
    super.update();

    this.scene.update();
  }
}

export { TemplateComponent };
