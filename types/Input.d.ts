import { Vector2 } from "three";

 export class Input {
    /**
     * Works for left mouse button or first touch on the screen (primary touch).
    */
    static left_mouse_button_pressed: boolean;
    /**
     * Works for left mouse button or first touch on the screen (primary touch).
    */
    static left_mouse_button_down: boolean;
    /**
     * Works for left mouse button or first touch on the screen (primary touch).
    */
    static left_mouse_button_released: boolean;

    /**
     * Mouse only.
    */
    static middle_mouse_button_pressed: boolean;
    /**
     * Mouse only.
    */
    static middle_mouse_button_down: boolean;
    /**
     * Mouse only.
    */
    static middle_mouse_button_released: boolean;

    /**
     * Mouse only.
    */
    static right_mouse_button_pressed: boolean;
    /**
     * Mouse only.
    */
    static right_mouse_button_down: boolean;
    /**
     * Mouse only.
    */
    static right_mouse_button_released: boolean;

    /**
     * Mouse and primary touch.
    */
    static clicked: boolean;

    /**
     * Screen coordinates of the mouse (or primary touch) position.
    */
    static pointer_pos: {
        x: number;
        y: number;
    };

    /**
     * Difference between previous position and current position.
    */
    static pointer_pos_delta: {
        x: number;
        y: number;
    };

    /**
     * Screen coordinates of the mouse (or primary touch) position, where the origin is in the upper left corner (browser coordinates).
    */
    static html_pointer_pos: {
        x: number;
        y: number;
    };

    /**
     * The center of all active touches. If using mouse, this is the same as pointer_pos.
    */
    static pointer_center: {
        x: number;
        y: number;
    };

    /**
     * The center of all active touches. If using mouse, this is the same as pointer_pos.
    */
    static pointer_center_delta: {
        x: number;
        y: number;
    };

    /**
     * [-1..1] the center of all active touches. If using mouse, this is the same as pointer_pos.
    */
    static pointer_center_NDC: {
        x: number;
        y: number;
    };

    /**
     * [-1..1] difference between previous normalized center and current one.
    */
    static pointer_center_NDC_delta: {
        x: number;
        y: number;
    };

    /**
     * Normalized [-1..1] device coordinates for mouse or primary touch.
    */
    static NDC: {
        x: number;
        y: number;
    };

    /**
     * [-1..1] difference between previous normalized position and current normalized position.
    */
    static NDC_delta: {
        x: number;
        y: number;
    };

    /**
     * Normalized [-1..1] device coordinates for mouse or primary touch, but in browser space (upper left corner maps to <-1,-1>).
    */
    static html_NDC: {
        x: number;
        y: number;
    };

    /**
     * Normalized [-1..1] device coordinates for mouse or primary touch, captured when left click is pressed.
    */
    static captured_NDC: {
        x: number;
        y: number;
    };

    /**
     * This is equivalent to the mouse wheel (-1, 0, 1) or dragging with one finger [-x..x] measured in pixels.
    */
    static scroll_delta: float;

    /**
     * This is equivalent to the mouse wheel (-1, 0, 1) or pinching with two fingers [-x..x] measured in pixels.
    */
    static zoom_delta: float;

    /**
     * Returns 1 if any mouse button is down, or return the amount of active touches.
    */
    static pointer_count: integer;

    /**
     * True if the mouse or primary touch is contained within the bounds of the subregion
    */
    static pointer_is_within_bounds: boolean;

    /**
     * True if the pointer is over an html element
    */
    static pointer_is_over_element(html_element: any): boolean;

     /**
     * Call this at the beginning of the current frame.
    */
    static update(): void;

    /**
     * Call this at the end of the current frame.
    */
    static clear(): void;
}
