import { UIElementState } from './UIElementState';

class OnMouseExit extends UIElementState
{
  constructor()
  {
    super();
  }

  on_enter(ui_element)
  {
    ui_element.on_mouse_exit();
    ui_element.set_state(ui_element._on_idle_state);
  }
}

export { OnMouseExit };
