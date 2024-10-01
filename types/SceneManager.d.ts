export { scene_manager as SceneManager };
declare const scene_manager: SceneManager;
declare class SceneManager {
    init(): void;
    _current: Scene;
    /**
     * @param {string} name
     */
    add_scene(name: string): void;
    set current(arg: Scene);
    /** @type {Scene} */
    get current(): Scene;
    dispose(): void;
}
import { Scene } from "three/src/scenes/Scene";
