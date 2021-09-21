declare var _default: SceneManager;
export default _default;
declare class SceneManager {
    init(): void;
    _current: any;
    add_scene(name: any): void;
    set current(arg: any);
    get current(): any;
    dispose(): void;
}
