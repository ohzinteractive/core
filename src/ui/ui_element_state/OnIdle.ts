import { UIElement } from '../../components/UIElement';
import { UIElementState } from './UIElementState';

class OnIdle extends UIElementState
{
  constructor()
  {
    super();
  }

  /**
   * @param {UIElement} ui_element
   * @param {Vector2} normalized_mouse_position
   */
  update(ui_element: any, normalized_mouse_position: any)
  {
    if (ui_element.is_mouse_over(normalized_mouse_position))
    {
      ui_element.set_state(ui_element._on_enter_state);
    }
  }
}

export { OnIdle };
