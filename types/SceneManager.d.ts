import type { AbstractScene } from './scenes/AbstractScene';
declare class SceneManager {
    _current: AbstractScene;
    init(default_scene: AbstractScene): void;
    add_scene(name: string): void;
    get current(): AbstractScene;
    set current(scene: AbstractScene);
    dispose(): void;
}
declare const scene_manager: SceneManager;
export { scene_manager as SceneManager };
