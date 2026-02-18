import type { BufferGeometry } from "three";
export class GeometryUtilities {
    static convert_to_non_indexed_geometry(geometry_buffer: any): BufferGeometry;
    static add_barycentric_attribute(non_indexed_geometry_buffer: any): void;
}
