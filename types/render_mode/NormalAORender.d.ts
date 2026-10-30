import { SSAOComposeMaterial } from '../materials/SSAOComposeMaterial';
import { SSAOMaterial } from '../materials/SSAOMaterial';
import { BaseRender } from '../render_mode/BaseRender';
import { Blurrer } from '../render_utilities/Blurrer';
import { RenderTarget } from 'three';
declare class NormalAORender extends BaseRender {
    SSAO_RT: RenderTarget;
    blurrer: Blurrer;
    main_RT: RenderTarget;
    ssaa: number;
    ssao_compose_mat: SSAOComposeMaterial;
    ssao_mat: SSAOMaterial;
    constructor(use_ssaa?: boolean, use_exact_depth?: boolean);
    on_enter(): void;
    render(): void;
    __check_RT_size(): void;
}
export { NormalAORender };
