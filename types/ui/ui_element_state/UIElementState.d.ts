export class UIElementState {
    /**
     * @param {UIElement} ui_element
     * @param {Vector2} normalized_mouse_position
     */
    update(ui_element: UIElement, normalized_mouse_position: Vector2): void;
    /**
     * @param {UIElement} ui_element
     */
    on_enter(ui_element: UIElement): void;
    /**
     * @param {UIElement} ui_element
     */
    on_exit(ui_element: UIElement): void;
}
import { UIElement } from "../../components/UIElement";
import { Vector2 } from "three/src/math/Vector2";
