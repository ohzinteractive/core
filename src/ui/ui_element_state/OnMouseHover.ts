// @ts-check
import { Vector2 } from 'three'; // eslint-disable-line no-unused-vars
import { UIElement } from '../../components/UIElement'; // eslint-disable-line no-unused-vars
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
  on_enter(ui_element)
  {
    this.__trigger_on_hover(ui_element);
  }

  /**
   * @param {UIElement} ui_element
   * @param {Vector2} normalized_mouse_position
   */
  update(ui_element, normalized_mouse_position)
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
  __trigger_on_hover(ui_element)
  {
    ui_element.on_mouse_hover();
  }
}

export { OnMouseHover };
