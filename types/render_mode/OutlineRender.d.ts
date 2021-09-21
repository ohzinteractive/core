export default class OutlineRender {
    constructor(webgl: any);
    main_rt: any;
    rt1: any;
    rt2: any;
    compose_material: any;
    copy_material: any;
    box_blur_material: any;
    background_material: any;
    copy_plane: any;
    copy_scene: any;
    resize(w: any, h: any): void;
    render(webgl: any): void;
    __get_copy_material(): any;
    __get_box_blur_material(): any;
    __get_compose_material(): any;
    __get_background_material(): any;
    on_enter(webgl: any): void;
    on_exit(webgl: any): void;
}
