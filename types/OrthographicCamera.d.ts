import { Color, OrthographicCamera as TOrthographicCamera } from 'three';
declare class OrthographicCamera extends TOrthographicCamera {
    clear_alpha: number;
    clear_color: Color;
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number);
    copy(camera: OrthographicCamera): this;
}
export { OrthographicCamera };
