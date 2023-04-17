export { ui as UI };
declare const ui: UI;
declare class UI {
    init(input: any): void;
    input: any;
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
