export class BloomRender extends BaseRender {
    bloom_compose_mat: BloomComposeMaterial;
    main_RT: WebGLRenderTarget<import("three").Texture>;
    blur_RT: WebGLRenderTarget<import("three").Texture>;
    blurrer: Blurrer;
    on_enter(): void;
    __check_RT_size(): void;
}
import { BaseRender } from "../render_mode/BaseRender";
import { BloomComposeMaterial } from "../materials/BloomComposeMaterial";
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { Blurrer } from "../render_utilities/Blurrer";
