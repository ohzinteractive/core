import type { BufferGeometry } from 'three';
import { Vector3 } from 'three';
declare class ReflectionPlaneContext {
    target_geometry: BufferGeometry;
    target_position: Vector3;
    init(): void;
    set_target_geometry(geometry: BufferGeometry): void;
}
declare const reflection_plane_context: ReflectionPlaneContext;
export { reflection_plane_context as ReflectionPlaneContext };
