
import { Vector2 } from 'three';
import { UIElement } from '../../components/UIElement';

class UIElementState
{
  constructor()
  {

  }

  /**
   * @param {UIElement} ui_element
   * @param {Vector2} normalized_mouse_position
   */
  update(ui_element: any, normalized_mouse_position: any) 
  {

  }

  /**
   * @param {UIElement} ui_element
   */
  on_enter(ui_element: any) 
  {}

  /**
   * @param {UIElement} ui_element
   */
  on_exit(ui_element: any) 
  {}
}

export { UIElementState };
