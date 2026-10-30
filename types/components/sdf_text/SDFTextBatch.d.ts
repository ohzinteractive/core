import { SDFTextMaterial } from '../../materials/SDFTextMaterial';
import { SDFText } from './SDFText';
import { InstancedBufferGeometry, Mesh } from 'three';
declare class SDFTextBatch extends Mesh {
    font_layout: any;
    max_allocations: number;
    text_elements: SDFText[];
    material: SDFTextMaterial;
    geometry: InstancedBufferGeometry;
    constructor(font_layout: any, atlas_texture: any);
    set_boldness(value: number): void;
    add_text(text_str: string): SDFText;
    remove_text(text_elem: SDFText): void;
    update(force_update: boolean): void;
    dispose(): void;
}
export { SDFTextBatch };
