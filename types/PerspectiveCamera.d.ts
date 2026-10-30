import { Color, PerspectiveCamera as TPerspectiveCamera } from 'three';
declare class PerspectiveCamera extends TPerspectiveCamera {
    clear_alpha: number;
    clear_color: Color;
    constructor(fov: number, aspect: number, near: number, far: number);
    copy(camera: PerspectiveCamera): this;
}
export { PerspectiveCamera };
