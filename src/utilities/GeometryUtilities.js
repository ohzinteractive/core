import * as THREE from 'three';

export default class GeometryUtilities
{
  static convert_to_non_indexed_geometry(geometry_buffer)
  {
    let indices = geometry_buffer.index;
    let positions = geometry_buffer.getAttribute('position');

    let bar_coordinates = [];
    let vertices = [];

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

    let geometry = new THREE.BufferGeometry();
    // geometry.setAttribute('barycentric', new THREE.BufferAttribute( new Float32Array(bar_coordinates), 3 ));
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    GeometryUtilities.add_barycentric_attribute(geometry);
    return geometry;
  }

  static add_barycentric_attribute(non_indexed_geometry_buffer)
  {
    let bar_coordinates = [];
    let positions = non_indexed_geometry_buffer.getAttribute('position');

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
    non_indexed_geometry_buffer.setAttribute('barycentric', new THREE.BufferAttribute(new Float32Array(bar_coordinates), 3));
  }
}
