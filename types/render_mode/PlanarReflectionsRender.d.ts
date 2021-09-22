export class PlanarReflectionsRender extends BaseRender {
    plane_material_solid: any;
    stencil_mask_scene: any;
    original_view_matrix: any;
    inverted_view_matrix: any;
    reflection_matrix: any;
    gl: any;
    plane_mask: any;
    plane_solid: any;
    __render_stencil_mask(renderer: any, gl: any): void;
    __render_reflected_scene(renderer: any, gl: any): void;
}
import { BaseRender } from "../render_mode/BaseRender";
