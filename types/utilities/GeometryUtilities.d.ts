import { BufferGeometry } from 'three';
declare class GeometryUtilities {
    static convert_to_non_indexed_geometry(geometry_buffer: BufferGeometry): BufferGeometry<import("three").NormalBufferAttributes, import("three").BufferGeometryEventMap>;
    static add_barycentric_attribute(non_indexed_geometry_buffer: BufferGeometry): void;
}
export { GeometryUtilities };
