export class PerspectiveCamera extends TPerspectiveCamera {
    /**
     * @param {number} fov
     * @param {number} aspect
     * @param {number} near
     * @param {number} far
     */
    constructor(fov: number, aspect: number, near: number, far: number);
    clear_color: Color;
    clear_alpha: number;
    /**
     * @param {PerspectiveCamera} camera
     * @returns {this}
     */
    copy(camera: PerspectiveCamera): this;
}
import { PerspectiveCamera as TPerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Color } from "three/src/math/Color";
