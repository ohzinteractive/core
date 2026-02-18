import { Color, RenderTarget } from 'three';
import type { Renderer, Texture } from 'three/webgpu';
import { ViewPositionMaterial } from '../materials/ViewPositionMaterial';
declare class ViewPositionRenderer {
    RT: RenderTarget;
    clear_color: Color;
    render_pos_mat: ViewPositionMaterial;
    constructor();
    render(context: any, renderer: Renderer): void;
    get render_target(): RenderTarget<Texture<unknown>>;
}
export { ViewPositionRenderer };
