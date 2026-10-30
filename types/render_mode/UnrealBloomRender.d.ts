import { AddMaterial } from '../materials/AddMaterial';
import { UnrealBloomComposeMaterial } from '../materials/UnrealBloomComposeMaterial';
import { BaseRender } from '../render_mode/BaseRender';
import { RenderTarget } from 'three';
import { GaussianBlurrer } from '../render_utilities/GaussianBlurrer';
declare class UnrealBloomRender extends BaseRender {
    add_mat: AddMaterial;
    bloom_compose_mat: UnrealBloomComposeMaterial;
    blurrer: GaussianBlurrer;
    luminosity_threshold: any;
    main_RT: RenderTarget;
    use_hight_luminosity_pass: boolean;
    use_rendering_size: boolean;
    constructor(use_antialiasing: boolean, use_half_float: boolean, use_hight_luminosity_pass: boolean, use_rendering_size?: boolean);
    on_enter(): void;
    render(): void;
    set_bloom_strength(val: number): void;
    set_bloom_radius(val: number): void;
    set_luminosity_threshold(value: number): void;
    set_tint_color_0(col_string: string): void;
    set_tint_color_1(col_string: string): void;
    set_tint_color_2(col_string: string): void;
    set_tint_color_3(col_string: string): void;
    set_tint_color_4(col_string: string): void;
    __check_RT_size(): void;
}
export { UnrealBloomRender };
