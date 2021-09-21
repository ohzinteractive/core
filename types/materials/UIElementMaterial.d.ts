export default class UIElementMaterial extends BaseShaderMaterial {
    constructor(intensity?: number);
    transparent: boolean;
    depthWrite: boolean;
    depthTest: boolean;
}
import BaseShaderMaterial from "../materials/BaseShaderMaterial";
