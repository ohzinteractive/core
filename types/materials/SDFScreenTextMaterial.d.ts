export class SDFScreenTextMaterial extends BaseShaderMaterial {
    constructor(texture: any);
    extensions: {
        derivatives: boolean;
    };
    side: 2;
    set_atlas_size(size: any): void;
}
import { BaseShaderMaterial } from "./BaseShaderMaterial";
