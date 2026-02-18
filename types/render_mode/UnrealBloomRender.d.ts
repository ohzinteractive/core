import type { RenderTarget, Texture } from "three";
import type { AddMaterial } from "../materials/AddMaterial";
import type { UnrealBloomComposeMaterial } from "../materials/UnrealBloomComposeMaterial";
import { BaseRender } from "../render_mode/BaseRender";
import type { GaussianBlurrer } from "../render_utilities/GaussianBlurrer";

export class UnrealBloomRender extends BaseRender {
    bloom_compose_mat: UnrealBloomComposeMaterial;
    main_RT: RenderTarget<Texture>;
    blur_RT: RenderTarget<Texture>;
    blurrer: GaussianBlurrer;
    add_mat: AddMaterial;
    on_enter(): void;
    set_bloom_strength(val: any): void;
    set_bloom_radius(val: any): void;
    set_tint_color_0(col_string: any): void;
    set_tint_color_1(col_string: any): void;
    set_tint_color_2(col_string: any): void;
    set_tint_color_3(col_string: any): void;
    set_tint_color_4(col_string: any): void;
    __check_RT_size(): void;
}
