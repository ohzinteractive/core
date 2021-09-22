 export class UI {
    static init(): void;
    static ui_elements: any[];
    static _tmp_normalized_pos: any;
    static ss_scene: any;
    static ws_scene: any;
    static ss_camera: any;
    static delete_element(elem: any): void;
    static add_screen_space_element(elem: any): void;
    static add_world_space_element(elem: any): void;
    static update(): void;
    static render(renderer: any): void;
    static clear(): void;
    static current_clicked_element: any;
}
