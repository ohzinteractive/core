export class Blitter {
    constructor(renderer: any);
    renderer: any;
    _blit_scene: any;
    _blit_material: BlitMaterial;
    _blit_quad: any;
    _blit_camera: any;
    blit(src: any, dst: any): void;
    material_pass(mat: any, dst: any): void;
    blit_with_material(src: any, dst: any, mat: any): void;
    blit_clear_with_material(dst_RT: any, mat: any): void;
    dispose(): void;
    __render(RT: any): void;
}
import { BlitMaterial } from "../materials/BlitMaterial";
