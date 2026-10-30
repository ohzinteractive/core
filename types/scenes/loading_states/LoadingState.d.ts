import type { AsyncAbstractLoader } from '../../loaders/AsyncAbstractLoader';
import type { AbstractScene } from '../AbstractScene';
import type { Compilator, CompilatorConstructor } from '../Compilator';
import { CompilatorManager } from '../CompilatorManager';
export interface LoadingCompilators {
    AudiosCompilator?: CompilatorConstructor;
    SceneCompilator?: CompilatorConstructor;
    TexturesCompilator?: CompilatorConstructor;
}
export declare class LoadingState {
    AudiosCompilator: CompilatorConstructor;
    SceneCompilator: CompilatorConstructor;
    TexturesCompilator: CompilatorConstructor;
    callback_called: boolean;
    compilator_manager: CompilatorManager;
    compilators: Compilator[];
    custom_compilators: CompilatorConstructor[];
    custom_data: any[];
    custom_loaders: any[];
    loaders: AsyncAbstractLoader[];
    scene: AbstractScene;
    scene_objects: any[];
    scene_sounds: any[];
    scene_textures: any[];
    constructor(scene: AbstractScene, { SceneCompilator, TexturesCompilator, AudiosCompilator }: LoadingCompilators);
    set_assets(scene_objects: any[], scene_textures: any[], scene_sounds: any[], custom_loaders?: any[], custom_compilators?: CompilatorConstructor[], custom_data?: any[]): void;
    get loading_progress(): number;
    load(): void;
    on_enter(): void;
    on_exit(): void;
    update(): void;
    setup_loader(): void;
    is_loaded(): boolean;
    is_compiled(): boolean;
}
