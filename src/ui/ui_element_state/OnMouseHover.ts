import { Vector2 } from 'three';
import { UIElement } from '../../components/UIElement';
import { UIElementState } from './UIElementState';

class OnMouseHover extends UIElementState
{
  constructor()
  {
    super();
  }

  /**
   * @param {UIElement} ui_element
   */
  on_enter(ui_element: any)
  {
    this.__trigger_on_hover(ui_element);
  }

  /**
   * @param {UIElement} ui_element
   * @param {Vector2} normalized_mouse_position
   */
  update(ui_element: any, normalized_mouse_position: any)
  {
    if (ui_element.is_mouse_over(normalized_mouse_position))
    {
      this.__trigger_on_hover(ui_element);
    }
    else
    {
      ui_element.set_state(ui_element._on_exit_state);
    }
  }

  /**
   * @param {UIElement} ui_element
   */
  __trigger_on_hover(ui_element: any)
  {
    ui_element.on_mouse_hover();
  }
}

export { OnMouseHover };
