import UIElementState from './UIElementState';

export default class OnMouseEnter extends UIElementState
{
  constructor()
  {
    super();
  }

  on_enter(ui_element)
  {
    ui_element.on_mouse_enter();
  }

  update(ui_element, normalized_mouse_position)
  {
    if (ui_element.is_mouse_over(normalized_mouse_position))
    {
      ui_element.set_state(ui_element._on_hover_state);
    }
    else
    {
      ui_element.set_state(ui_element._on_exit_state);
    }
  }
}
