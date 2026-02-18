import type { Vector2 } from "three";
import { BlitMaterial } from "../materials/BlitMaterial";

export class MedianFilterMaterial extends BlitMaterial {
    constructor();
    set_texture(tex: any): void;
    get_size(tex: any): Vector2;
}
