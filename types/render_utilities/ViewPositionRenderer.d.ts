import type { RenderTarget, Texture } from "three";
import { Color } from "three";
import { ViewPositionMaterial } from "../materials/ViewPositionMaterial";

export class ViewPositionRenderer {
    RT: RenderTarget<Texture>;
    clear_color: Color;
    render_pos_mat: ViewPositionMaterial;
    render(context: any, renderer: any): void;
    get render_target(): RenderTarget<Texture>;
}
