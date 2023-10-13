export { view_manager as ViewManager };
declare const view_manager: ViewManager;
declare class ViewManager {
    views: any[];
    main_to_worker: any;
    browser_title_suffix: string;
    go_to_view(view_name: any, change_url?: boolean, skip?: boolean): void;
    go_to_scene(scene_name: any, change_url?: boolean, skip?: boolean): void;
    set_browser_title_suffix(title_suffix: any): void;
    get(view_name: any): any;
    get_by_url(url: any): any;
    register_view(view: any): void;
    set_main_to_worker(main_to_worker: any): void;
    __change_browser_url(url: any): void;
    __change_browser_title(name: any): void;
    __capitalize(string: any): any;
    __snake_to_whitespace(string: any): any;
}
