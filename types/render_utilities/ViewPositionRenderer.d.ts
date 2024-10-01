export class ViewPositionRenderer {
    RT: WebGLRenderTarget<import("three").Texture>;
    clear_color: Color;
    render_pos_mat: ViewPositionMaterial;
    render(context: any, renderer: any): void;
    get render_target(): WebGLRenderTarget<import("three").Texture>;
}
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { Color } from "three/src/math/Color";
import { ViewPositionMaterial } from "../materials/ViewPositionMaterial";
