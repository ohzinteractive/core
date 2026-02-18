import type { RenderTarget, Texture, Vector2 } from "three";
import type { MedianFilterMaterial } from "../materials/MedianFilterMaterial";

export class MedianFilter {
    constructor(renderer: any);
    RT: RenderTarget<Texture>;
    RT1: RenderTarget<Texture>;
    median_filter_mat: MedianFilterMaterial;
    
    filter(texture: any): RenderTarget<Texture>;
    get_size(tex: any): Vector2;
}
