export class SDFTextBatch {
    constructor(font_layout: any, atlas_texture: any);
    text_elements: any[];
    font_layout: any;
    frustumCulled: boolean;
    set_boldness(value: any): void;
    add_text(text_str: any): SDFText;
    remove_text(text_elem: any): void;
    update(force_update: any): void;
    dispose(): void;
}
import { SDFText } from "./SDFText";
