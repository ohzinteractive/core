import { BlitMaterial } from '../materials/BlitMaterial';
import type { RenderTarget, Texture } from 'three';
import { Matrix4 } from 'three';
declare class DeferredRendererComposeMaterial extends BlitMaterial {
    constructor();
    set_normal_depth_rt(rt: RenderTarget): void;
    set_albedo_rt(tex: Texture): void;
    set_proj_matrix(mat4: Matrix4): void;
}
export { DeferredRendererComposeMaterial };
