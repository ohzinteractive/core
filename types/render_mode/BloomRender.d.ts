import { BloomComposeMaterial } from '../materials/BloomComposeMaterial';
import { BaseRender } from '../render_mode/BaseRender';
import { RenderTarget } from 'three';
import { Blurrer } from '../render_utilities/Blurrer';
declare class BloomRender extends BaseRender {
    bloom_compose_mat: BloomComposeMaterial;
    blur_RT: RenderTarget;
    blurrer: Blurrer;
    main_RT: RenderTarget;
    constructor();
    on_enter(): void;
    render(): void;
    __check_RT_size(): void;
}
export { BloomRender };
