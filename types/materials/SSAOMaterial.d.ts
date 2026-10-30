import { BlitNodeMaterial } from '../materials/BlitNodeMaterial';
import { DataTexture, Matrix4, Vector3 } from 'three';
declare class SSAOMaterial extends BlitNodeMaterial {
    sample_kernel: Vector3[];
    use_exact_depth: boolean;
    constructor(use_exact_depth?: boolean);
    set_projection_matrix(projection_matrix: Matrix4): void;
    __get_sample_kernel(): Vector3[];
    __get_rotation_texture(): DataTexture;
}
export { SSAOMaterial };
