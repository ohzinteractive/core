import type { AbstractScene } from '../AbstractScene';
import { LoadingState } from './LoadingState';
export declare class HighQualityLoadingState extends LoadingState {
    scene: AbstractScene;
    on_enter(): void;
    on_exit(): void;
    update(): void;
}
