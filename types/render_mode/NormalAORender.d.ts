export class NormalAORender extends BaseRender {
    constructor(use_ssaa?: boolean);
    ssao_mat: SSAOMaterial;
    ssao_compose_mat: SSAOComposeMaterial;
    debug_normals: DisplayNormalTextureMaterial;
    ssaa: number;
    main_RT: WebGLRenderTarget<import("three").Texture>;
    SSAO_RT: WebGLRenderTarget<import("three").Texture>;
    blurrer: Blurrer;
    __update_uniforms(): void;
    __check_RT_size(): void;
}
import { BaseRender } from "../render_mode/BaseRender";
import { SSAOMaterial } from "../materials/SSAOMaterial";
import { SSAOComposeMaterial } from "../materials/SSAOComposeMaterial";
import { DisplayNormalTextureMaterial } from "../materials/DisplayNormalTextureMaterial";
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { Blurrer } from "../render_utilities/Blurrer";
