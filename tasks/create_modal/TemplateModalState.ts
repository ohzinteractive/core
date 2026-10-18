import type { AbstractModalComponent } from 'ohzi-components';
import { ModalState } from 'ohzi-components';

class TemplateModalState extends ModalState
{
  constructor(name: string)
  {
    super(name);
  }

  on_enter(modal_component: AbstractModalComponent)
  {
    super.on_enter(modal_component);
  }

  on_exit(modal_component: AbstractModalComponent)
  {
    super.on_exit(modal_component);
  }

  update(modal_component: AbstractModalComponent)
  {
    super.update(modal_component);
  }
}

export { TemplateModalState };
