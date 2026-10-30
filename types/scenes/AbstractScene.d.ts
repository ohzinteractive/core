import type { Object3D } from 'three';
import { Scene } from 'three';
import type { CameraController } from '../camera_controller/CameraController';
import type { CompilatorConstructor } from './Compilator';
import { HighQualityLoadingState } from './loading_states/HighQualityLoadingState';
import type { LoadingCompilators } from './loading_states/LoadingState';
import { LoadingState } from './loading_states/LoadingState';
import { RegularLoadingState } from './loading_states/RegularLoadingState';
declare class AbstractScene extends Scene {
    current_loading_state: LoadingState;
    initialized: boolean;
    is_high_loaded: boolean;
    is_loaded: boolean;
    loading_states: {
        high: HighQualityLoadingState;
        regular: RegularLoadingState;
    };
    name: string;
    camera_controller: CameraController;
    constructor({ name, compilators }: {
        name: string;
        compilators: LoadingCompilators;
    });
    get loading_progress(): number;
    init(): void;
    load(): void;
    get_objects(): Object3D<import("three").Object3DEventMap>[];
    dispose_cpu(): void;
    dispose(): void;
    set_assets(scene_objects: any[], scene_textures: any[], scene_sounds: any[], custom_loaders?: any[], custom_compilators?: CompilatorConstructor[], custom_data?: any[]): void;
    set_high_assets(scene_objects: any[], scene_textures: any[], scene_sounds: any[], custom_loaders?: any[], custom_compilators?: CompilatorConstructor[], custom_data?: any[]): void;
    set_loading_state(state: LoadingState): void;
    update_loading_state(): void;
    update(): void;
    on_assets_ready(): void;
    on_assets_compiled(): void;
    on_high_quality_assets_ready(): void;
    on_pre_render(): void;
    render(): void;
    on_post_render(): void;
}
export { AbstractScene };
