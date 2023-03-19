
export { input as Input };
declare const input: Input;
declare class Input {
    /**
     * Works for left mouse button or first touch on the screen (primary touch).
    */
    left_mouse_button_pressed: boolean;
    /**
     * Works for left mouse button or first touch on the screen (primary touch).
    */
    left_mouse_button_down: boolean;
    /**
     * Works for left mouse button or first touch on the screen (primary touch).
    */
    left_mouse_button_released: boolean;

    /**
     * Mouse only.
    */
    middle_mouse_button_pressed: boolean;
    /**
     * Mouse only.
    */
    middle_mouse_button_down: boolean;
    /**
     * Mouse only.
    */
    middle_mouse_button_released: boolean;

    /**
     * Mouse only.
    */
    right_mouse_button_pressed: boolean;
    /**
     * Mouse only.
    */
    right_mouse_button_down: boolean;
    /**
     * Mouse only.
    */
    right_mouse_button_released: boolean;

    /**
     * Mouse and primary touch.
    */
    clicked: boolean;

    /**
     * Screen coordinates of the mouse (or primary touch) position.
    */
    pointer_pos: {
        x: number;
        y: number;
    };

    /**
     * Difference between previous position and current position.
    */
    pointer_pos_delta: {
        x: number;
        y: number;
    };

    /**
     * Screen coordinates of the mouse (or primary touch) position, where the origin is in the upper left corner (browser coordinates).
    */
    html_pointer_pos: {
        x: number;
        y: number;
    };

    /**
     * The center of all active touches. If using mouse, this is the same as pointer_pos.
    */
    pointer_center: {
        x: number;
        y: number;
    };

    /**
     * The center of all active touches. If using mouse, this is the same as pointer_pos.
    */
    pointer_center_delta: {
        x: number;
        y: number;
    };

    /**
     * [-1..1] the center of all active touches. If using mouse, this is the same as pointer_pos.
    */
    pointer_center_NDC: {
        x: number;
        y: number;
    };

    /**
     * [-1..1] difference between previous normalized center and current one.
    */
    pointer_center_NDC_delta: {
        x: number;
        y: number;
    };

    /**
     * Normalized [-1..1] device coordinates for mouse or primary touch.
    */
    NDC: {
        x: number;
        y: number;
    };

    /**
     * [-1..1] difference between previous normalized position and current normalized position.
    */
    NDC_delta: {
        x: number;
        y: number;
    };

    /**
     * Normalized [-1..1] device coordinates for mouse or primary touch, but in browser space (upper left corner maps to <-1,-1>).
    */
    html_NDC: {
        x: number;
        y: number;
    };

    /**
     * Normalized [-1..1] device coordinates for mouse or primary touch, captured when left click is pressed.
    */
    captured_NDC: {
        x: number;
        y: number;
    };

    current_NDC_delta: {
        x: number;
        y: number;
    };

    /**
     * This is equivalent to the mouse wheel (-1, 0, 1) or dragging with one finger [-x..x] measured in pixels.
    */
    scroll_delta: number;

    /**
     * This is equivalent to the mouse wheel (-1, 0, 1) or pinching with two fingers [-x..x] measured in pixels.
    */
    zoom_delta: number;

    /**
     * Returns 1 if any mouse button is down, or return the amount of active touches.
    */
    pointer_count: number;

    /**
     * True if the mouse or primary touch is contained within the bounds of the subregion
    */
    pointer_is_within_bounds: boolean;

    /**
     * True if the pointer is over an html element
    */
    pointer_is_over_element(html_element: any): boolean;

     /**
     * Call this at the beginning of the current frame.
    */
    update(): void;

    /**
     * Call this at the end of the current frame.
    */
    clear(): void;

    keyboard: KeyboardInput;

    init(container: any, keyboard_input_container: any): void;
    dispose(): void;
}

import { KeyboardInput } from "./KeyboardInput";
