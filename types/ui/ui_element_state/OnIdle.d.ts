export class OnIdle extends UIElementState {
    /**
     * @param {UIElement} ui_element
     * @param {Vector2} normalized_mouse_position
     */
    update(ui_element: UIElement, normalized_mouse_position: Vector2): void;
}
import { UIElementState } from "./UIElementState";
import { UIElement } from "../../components/UIElement";
