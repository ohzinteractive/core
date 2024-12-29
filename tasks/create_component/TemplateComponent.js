import { ViewComponent } from 'ohzi-core';
import { Components } from '../Components';

class TemplateComponent extends ViewComponent
{
  constructor()
  {
    super({
      name: Components.TEMPLATE,
      container: document.querySelector('.template')
    });
  }

  start()
  {
  }

  on_enter()
  {
    super.on_enter();
  }

  on_exit()
  {
    super.on_exit();
  }

  update(current_state_data)
  {
    super.update();
  }
}

export { TemplateComponent };
