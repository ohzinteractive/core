import { ViewComponentController } from 'ohzi-core';
import { Components } from '../Components';

class TemplateComponentController extends ViewComponentController
{
  constructor()
  {
    super({
      name: Components.TEMPLATE
    });
  }

  start()
  {
    super.start();
  }

  on_enter()
  {
    super.on_enter();
  }

  on_exit()
  {
    super.on_exit();
  }

  update()
  {
    super.update();
  }
}

export { TemplateComponentController };
