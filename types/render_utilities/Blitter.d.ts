import type { Renderer } from 'three/webgpu';
import { BlitNodeMaterial } from '../materials/BlitNodeMaterial';
import { Mesh, OrthographicCamera, PlaneGeometry, Scene } from 'three';
declare class Blitter {
    _blit_camera: OrthographicCamera;
    _blit_material: BlitNodeMaterial;
    _blit_quad: Mesh<PlaneGeometry, BlitNodeMaterial>;
    _blit_scene: Scene;
    renderer: Renderer;
    constructor(renderer: Renderer);
    blit(src: any, dst: any): void;
    material_pass(mat: any, dst: any): void;
    blit_with_material(src: any, dst: any, mat: any): void;
    blit_clear_with_material(dst_RT: any, mat: any): void;
    dispose(): void;
    __render(dst_RT?: any): void;
}
export { Blitter };
