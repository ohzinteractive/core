export { scene_manager as SceneManager };
declare const scene_manager: SceneManager;
declare class SceneManager {
    init(): void;
    _current: Scene;
    add_scene(name: any): void;
    set current(arg: any);
    get current(): any;
    dispose(): void;
}

import { Scene } from "three";
