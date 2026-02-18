import { BlitMaterial } from '../../materials/BlitMaterial';
declare class AttributeUpdateMaterial extends BlitMaterial {
    multiplier: number;
    constructor(custom_frag?: string);
    update(): void;
    set_multiplier(val: number): void;
}
export { AttributeUpdateMaterial };
