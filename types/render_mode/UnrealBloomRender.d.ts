export default class UnrealBloomRender extends BaseRender {
    bloom_compose_mat: UnrealBloomComposeMaterial;
    main_RT: any;
    blur_RT: any;
    blurrer: GaussianBlurrer;
    add_mat: AddMaterial;
    set_bloom_strength(val: any): void;
    set_bloom_radius(val: any): void;
    set_tint_color_0(col_string: any): void;
    set_tint_color_1(col_string: any): void;
    set_tint_color_2(col_string: any): void;
    set_tint_color_3(col_string: any): void;
    set_tint_color_4(col_string: any): void;
    __check_RT_size(): void;
}
import BaseRender from "../render_mode/BaseRender";
import UnrealBloomComposeMaterial from "../materials/UnrealBloomComposeMaterial";
import GaussianBlurrer from "../render_utilities/GaussianBlurrer";
import AddMaterial from "../materials/AddMaterial";
