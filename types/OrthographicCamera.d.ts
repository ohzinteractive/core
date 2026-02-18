import { OrthographicCamera as TOrthographicCamera } from "three";
import { Color } from "three";

t class OrthographicCamera extends TOrthographicCamera {
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number);
    clear_color: Color;
    clear_alpha: number;

    copy(camera: OrthographicCamera): this;
}
