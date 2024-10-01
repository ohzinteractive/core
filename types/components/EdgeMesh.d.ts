export class EdgeMesh extends Object3D<import("three").Object3DEventMap> {
    /**
     * @param {BufferGeometry} buffer_geometry
     * @param {number} [thickness]
     * @param {string} [color]
     */
    constructor(buffer_geometry: BufferGeometry, thickness?: number, color?: string);
    edges_material: ShaderMaterial;
    corners_material: ShaderMaterial;
    edges_mesh: Mesh<BufferGeometry<import("three").NormalBufferAttributes>, ShaderMaterial, import("three").Object3DEventMap>;
    corners_mesh: Mesh<BufferGeometry<import("three").NormalBufferAttributes>, ShaderMaterial, import("three").Object3DEventMap>;
    /**
     * @param {BufferGeometry} cube_geometry
     * @returns {Vector3[]}
     */
    __get_edges(cube_geometry: BufferGeometry): Vector3[];
    /**
     * @param {number} TIME
     */
    update(TIME: number): void;
    /**
     * @param {Vector3[]} points
     */
    __get_edges_geometry(points: Vector3[]): BufferGeometry<import("three").NormalBufferAttributes>;
    /**
     * @param {BufferAttribute | InterleavedBufferAttribute} geometry_vertices
     * @returns {BufferGeometry}
     */
    __get_corners_geometry(geometry_vertices: BufferAttribute | InterleavedBufferAttribute): BufferGeometry;
    /**
     * @param {boolean} boolean
     */
    set_visible(boolean: boolean): void;
    dispose(): void;
}
import { Object3D } from "three/src/core/Object3D";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { Vector3 } from "three/src/math/Vector3";
import { BufferAttribute } from "three/src/core/BufferAttribute";
import { InterleavedBufferAttribute } from "three/src/core/InterleavedBufferAttribute";
