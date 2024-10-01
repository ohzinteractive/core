export class Blitter {
    constructor(renderer: any);
    renderer: any;
    _blit_scene: Scene;
    _blit_material: BlitMaterial;
    _blit_quad: Mesh<PlaneGeometry, BlitMaterial, import("three").Object3DEventMap>;
    _blit_camera: OrthographicCamera;
    blit(src: any, dst: any): void;
    material_pass(mat: any, dst: any): void;
    blit_with_material(src: any, dst: any, mat: any): void;
    blit_clear_with_material(dst_RT: any, mat: any): void;
    dispose(): void;
    __render(RT: any): void;
}
import { Scene } from "three/src/scenes/Scene";
import { BlitMaterial } from "../materials/BlitMaterial";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { OrthographicCamera } from "three/src/cameras/OrthographicCamera";
