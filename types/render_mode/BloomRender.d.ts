import { RenderTarget, Texture } from "three";
import { BloomComposeMaterial } from "../materials/BloomComposeMaterial";
import { BaseRender } from "../render_mode/BaseRender";
import { Blurrer } from "../render_utilities/Blurrer";
export class BloomRender extends BaseRender {
    bloom_compose_mat: BloomComposeMaterial;
    main_RT: RenderTarget<Texture>;
    blur_RT: RenderTarget<Texture>;
    blurrer: Blurrer;
    on_enter(): void;
    __check_RT_size(): void;
}
