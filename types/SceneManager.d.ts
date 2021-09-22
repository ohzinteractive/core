import { Scene } from "three";

export class SceneManager {
    static init(): void;
    static _current: Scene;
    static add_scene(name: string): void;
    static set current(arg: Scene);
    static get current(): Scene;
    static dispose(): void;
}
