import type { AbstractScene } from '../AbstractScene';
import type { LoadingCompilators } from './LoadingState';
import { LoadingState } from './LoadingState';
export declare class RegularLoadingState extends LoadingState {
    on_assets_ready_called: boolean;
    constructor(scene: AbstractScene, compilators: LoadingCompilators);
    on_enter(): void;
    on_exit(): void;
    update(): void;
}
