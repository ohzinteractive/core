declare var _default: UI;
export default _default;
declare class UI {
    init(): void;
    ui_elements: any[];
    _tmp_normalized_pos: any;
    ss_scene: any;
    ws_scene: any;
    ss_camera: any;
    delete_element(elem: any): void;
    add_screen_space_element(elem: any): void;
    add_world_space_element(elem: any): void;
    update(): void;
    render(renderer: any): void;
    clear(): void;
    current_clicked_element: any;
}
