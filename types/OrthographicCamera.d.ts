export class OrthographicCamera extends TOrthographicCamera {
    /**
     * @param {number} left
     * @param {number} right
     * @param {number} top
     * @param {number} bottom
     * @param {number} near
     * @param {number} far
     */
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number);
    clear_color: Color;
    clear_alpha: number;
    /**
     * @param {OrthographicCamera} camera
     * @returns {this}
     */
    copy(camera: OrthographicCamera): this;
}
import { OrthographicCamera as TOrthographicCamera } from "three/src/cameras/OrthographicCamera";
import { Color } from "three/src/math/Color";
