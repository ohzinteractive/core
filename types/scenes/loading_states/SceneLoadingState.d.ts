export class SceneLoadingState {
    constructor(scene: any, { SceneCompilator, TexturesCompilator, AudiosCompilator }: {
        SceneCompilator: any;
        TexturesCompilator: any;
        AudiosCompilator: any;
    });
    scene: any;
    SceneCompilator: any;
    TexturesCompilator: any;
    AudiosCompilator: any;
    loaders: any[];
    compilators: any[];
    callback_called: boolean;
    set_assets(scene_objects: any, scene_textures: any, scene_sounds: any): void;
    scene_objects: any;
    scene_textures: any;
    scene_sounds: any;
    get loading_progress(): number;
    load(): void;
    on_enter(): void;
    on_exit(): void;
    update(): void;
    setup_loader(): void;
    compilator_manager: CompilatorManager;
    is_loaded(): boolean;
    is_compiled(): boolean;
}
import { CompilatorManager } from "./CompilatorManager";
