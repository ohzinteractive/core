export class SDFScreenTextMaterial extends BaseShaderMaterial {
    constructor(texture: any);
    transparent: boolean;
    extensions: {
        derivatives: boolean;
    };
    depthWrite: boolean;
    side: any;
    set_atlas_size(size: any): void;
}
import { BaseShaderMaterial } from "./BaseShaderMaterial";
