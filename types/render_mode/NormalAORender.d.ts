import type { RenderTarget, Texture } from "three";
import type { DisplayNormalTextureMaterial } from "../materials/DisplayNormalTextureMaterial";
import type { SSAOComposeMaterial } from "../materials/SSAOComposeMaterial";
import type { SSAOMaterial } from "../materials/SSAOMaterial";
import { BaseRender } from "../render_mode/BaseRender";
import type { Blurrer } from "../render_utilities/Blurrer";
export class NormalAORender extends BaseRender {
    constructor(use_ssaa?: boolean);
    ssao_mat: SSAOMaterial;
    ssao_compose_mat: SSAOComposeMaterial;
    debug_normals: DisplayNormalTextureMaterial;
    ssaa: number;
    main_RT: RenderTarget<Texture>;
    SSAO_RT: RenderTarget<Texture>;
    blurrer: Blurrer;
    
    __update_uniforms(): void;
    __check_RT_size(): void;
}
