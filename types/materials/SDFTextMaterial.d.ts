export default class SDFTextMaterial extends BaseShaderMaterial {
    constructor(texture: any);
    transparent: boolean;
    extensions: {
        derivatives: boolean;
    };
    depthWrite: boolean;
    side: any;
    set_atlas_size(size: any): void;
    set_boldness(value: any): void;
}
import BaseShaderMaterial from "./BaseShaderMaterial";
