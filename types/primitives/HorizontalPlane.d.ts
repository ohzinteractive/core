import type { Material } from 'three';
import { Mesh } from 'three';
declare class HorizontalPlane extends Mesh {
    constructor(width?: number, height?: number, color?: number | string, material?: Material);
}
export { HorizontalPlane };
