import { BlitNodeMaterial } from './BlitNodeMaterial';
import { Texture } from 'three';
declare class AddMaterial extends BlitNodeMaterial {
    constructor(use_half_float?: boolean);
    set_add_texture(tex: Texture): void;
}
export { AddMaterial };
