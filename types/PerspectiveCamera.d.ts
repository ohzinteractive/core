import type { Color } from "three";
import { PerspectiveCamera as TPerspectiveCamera } from "three";

export class PerspectiveCamera extends TPerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number);
    clear_color: Color;
    clear_alpha: number;
    copy(camera: PerspectiveCamera): this;
}
