export class OutlineRender {
    constructor(webgl: any);
    main_rt: WebGLRenderTarget<import("three").Texture>;
    rt1: WebGLRenderTarget<import("three").Texture>;
    rt2: WebGLRenderTarget<import("three").Texture>;
    compose_material: ShaderMaterial;
    copy_material: ShaderMaterial;
    box_blur_material: ShaderMaterial;
    background_material: ShaderMaterial;
    copy_plane: Mesh<PlaneGeometry, ShaderMaterial, import("three").Object3DEventMap>;
    copy_scene: Scene;
    resize(w: any, h: any): void;
    render(webgl: any): void;
    __get_copy_material(): ShaderMaterial;
    __get_box_blur_material(): ShaderMaterial;
    __get_compose_material(): ShaderMaterial;
    __get_background_material(): ShaderMaterial;
    on_enter(webgl: any): void;
    on_exit(webgl: any): void;
}
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { Scene } from "three/src/scenes/Scene";
