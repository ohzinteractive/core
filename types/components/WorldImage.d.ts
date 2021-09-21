export default class WorldImage {
    constructor(texture: any, pivot: any);
    current_scale: number;
    tmp_bb_size: any;
    update_texture(): void;
    set size(arg: any);
    get size(): any;
    set screen_aligned(arg: boolean);
    get screen_aligned(): boolean;
    set opacity(arg: any);
    get opacity(): any;
    dispose(): void;
}
