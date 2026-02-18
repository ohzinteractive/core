import { Scene } from "three";
import type { HighQualityLoadingState } from "./loading_states/HighQualityLoadingState";
import type { LoadingState } from "./loading_states/LoadingState";
import type { RegularLoadingState } from "./loading_states/RegularLoadingState";

export class AbstractScene extends Scene {
    constructor({ name, compilators }: {
        name: any;
        compilators: any;
    });
    name: any;
    is_loaded: boolean;
    is_high_loaded: boolean;
    loading_states: {
        regular: RegularLoadingState;
        high: HighQualityLoadingState;
    };
    current_loading_state: LoadingState;
    get loading_progress(): number;
    init(): void;
    load(): void;
    get_objects(): any[];
    dispose_cpu(): void;
    dispose(): void;
    set_assets(scene_objects: any, scene_textures: any, scene_sounds: any, custom_loaders: any, custom_compilators: any, custom_data: any): void;
    set_high_assets(scene_objects: any, scene_textures: any, scene_sounds: any, custom_loaders: any, custom_compilators: any, custom_data: any): void;
    set_loading_state(state: any): void;
    update_loading_state(): void;
    update(): void;
    on_assets_ready(): void;
    on_assets_compiled(): void;
    on_high_quality_assets_ready(): void;
}
