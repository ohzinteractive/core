export class TransparencyMixRender {
    constructor(webgl: any);
    SSAA: number;
    main_rt: any;
    opaque_rt: any;
    fxaa_rt: any;
    mix_material: any;
    copy_material: any;
    fxaa_material: any;
    render_plane: any;
    copy_plane: any;
    mix_scene: any;
    copy_scene: any;
    resize(): void;
    __get_fxaa_material(): any;
    render(webgl: any): void;
    __render_opaque(webgl: any): void;
    __render_transparent(webgl: any): void;
    on_enter(webgl: any): void;
    on_exit(webgl: any): void;
}
