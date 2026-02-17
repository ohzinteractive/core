import { BufferAttribute, BufferGeometry } from 'three';

class GeometryUtilities
{
  static convert_to_non_indexed_geometry(geometry_buffer: BufferGeometry)
  {
    const indices = geometry_buffer.index;
    const positions = geometry_buffer.getAttribute('position');

    const bar_coordinates = [];
    const vertices = [];

    for (let i = 0; i < indices.count; i += 3)
    {
      // VERTEX 1
      vertices.push(positions.getX(indices.array[i + 0]));
      vertices.push(positions.getY(indices.array[i + 0]));
      vertices.push(positions.getZ(indices.array[i + 0]));

      bar_coordinates.push(1);
      bar_coordinates.push(0);
      bar_coordinates.push(0);

      // VERTEX 2

      vertices.push(positions.getX(indices.array[i + 1]));
      vertices.push(positions.getY(indices.array[i + 1]));
      vertices.push(positions.getZ(indices.array[i + 1]));

      bar_coordinates.push(0);
      bar_coordinates.push(1);
      bar_coordinates.push(0);

      // VERTEX 3

      vertices.push(positions.getX(indices.array[i + 2]));
      vertices.push(positions.getY(indices.array[i + 2]));
      vertices.push(positions.getZ(indices.array[i + 2]));

      bar_coordinates.push(0);
      bar_coordinates.push(0);
      bar_coordinates.push(1);
    }

    const geometry = new BufferGeometry();
    // geometry.setAttribute('barycentric', new BufferAttribute( new Float32Array(bar_coordinates), 3 ));
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    GeometryUtilities.add_barycentric_attribute(geometry);
    return geometry;
  }

  static add_barycentric_attribute(non_indexed_geometry_buffer: BufferGeometry)
  {
    const bar_coordinates = [];
    const positions = non_indexed_geometry_buffer.getAttribute('position');

    for (let i = 0; i < positions.count; i += 3)
    {
      bar_coordinates.push(1);
      bar_coordinates.push(0);
      bar_coordinates.push(0);

      bar_coordinates.push(0);
      bar_coordinates.push(1);
      bar_coordinates.push(0);

      bar_coordinates.push(0);
      bar_coordinates.push(0);
      bar_coordinates.push(1);
    }
    non_indexed_geometry_buffer.setAttribute('barycentric', new BufferAttribute(new Float32Array(bar_coordinates), 3));
  }
}

export { GeometryUtilities };
