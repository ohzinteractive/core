import type { Scene } from "three";
declare class SceneManager {
    _current: Scene;
    
    get current(): Scene;
    set current(arg: Scene);
    
    init(): void;
    add_scene(name: string): void;
    dispose(): void;
}

declare const scene_manager: SceneManager;
export { scene_manager as SceneManager };

