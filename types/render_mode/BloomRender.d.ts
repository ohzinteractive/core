import { BloomComposeMaterial } from '../materials/BloomComposeMaterial';
import { BaseRender } from '../render_mode/BaseRender';
import { RenderTarget } from 'three';
import { Blurrer } from '../render_utilities/Blurrer';
import { DualFilteringBlurrer } from '../render_utilities/DualFilteringBlurrer';
declare class BloomRender extends BaseRender {
    bloom_compose_mat: BloomComposeMaterial;
    blur_RT: RenderTarget;
    blurrer: Blurrer | DualFilteringBlurrer;
    main_RT: RenderTarget;
    use_dual_filtering: boolean;
    constructor(use_dual_filtering?: boolean);
    on_enter(): void;
    on_exit(): void;
    render(): void;
    __check_RT_size(): void;
}
export { BloomRender };
