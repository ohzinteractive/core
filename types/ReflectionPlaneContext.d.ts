export { reflection_plane_context as ReflectionPlaneContext };
declare const reflection_plane_context: ReflectionPlaneContext;
declare class ReflectionPlaneContext {
    init(): void;
    target_geometry: BufferGeometry<import("three").NormalBufferAttributes, import("three").BufferGeometryEventMap>;
    target_position: Vector3;
    /**
     * @param {BufferGeometry} geometry
     */
    set_target_geometry(geometry: BufferGeometry): void;
}
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Vector3 } from "three/src/math/Vector3";
