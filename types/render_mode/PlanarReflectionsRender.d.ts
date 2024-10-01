export class PlanarReflectionsRender extends BaseRender {
    plane_material_solid: ShaderMaterial;
    stencil_mask_scene: Scene;
    original_view_matrix: Matrix4;
    inverted_view_matrix: Matrix4;
    reflection_matrix: Matrix4;
    gl: any;
    plane_mask: Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, MeshBasicMaterial, import("three").Object3DEventMap>;
    plane_solid: Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, ShaderMaterial, import("three").Object3DEventMap>;
    render(context: any, renderer: any): void;
    __render_stencil_mask(renderer: any, gl: any): void;
    __render_reflected_scene(renderer: any, gl: any): void;
}
import { BaseRender } from "../render_mode/BaseRender";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { Scene } from "three/src/scenes/Scene";
import { Matrix4 } from "three/src/math/Matrix4";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";
