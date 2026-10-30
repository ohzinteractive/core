import { BaseRender } from '../render_mode/BaseRender';
import { NormalMaterial } from '../materials/NormalMaterial';
declare class DebugNormalsRender extends BaseRender {
    normal_material: NormalMaterial;
    constructor();
    render(): void;
}
export { DebugNormalsRender };
