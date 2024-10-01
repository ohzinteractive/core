export class SDFTextBatch extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    constructor(font_layout: any, atlas_texture: any);
    text_elements: any[];
    font_layout: any;
    set_boldness(value: any): void;
    add_text(text_str: any): SDFText;
    remove_text(text_elem: any): void;
    update(force_update: any): void;
    dispose(): void;
}
import { Mesh } from "three/src/objects/Mesh";
import { SDFText } from "./SDFText";
