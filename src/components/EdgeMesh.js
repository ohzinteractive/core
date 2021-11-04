import edge_line_vert from '../shaders/edges/edges.vert';
import edge_line_frag from '../shaders/edges/edges.frag';
import corners_vert from '../shaders/edges/corners.vert';
import corners_frag from '../shaders/edges/corners.frag';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { Object3D } from 'three';
import { ShaderMaterial } from 'three';
import { Color } from 'three';
import { Mesh } from 'three';
import { EdgesGeometry } from 'three';
import { LineSegments } from 'three';
import { LineBasicMaterial } from 'three';
import { Vector3 } from 'three';
import { PlaneBufferGeometry } from 'three';
import { BufferAttribute } from 'three';

export default class EdgeMesh extends Object3D
{
  constructor(buffer_geometry, thickness, color)
  {
    super();
    thickness = thickness || 0.1;
    color = color || '#555555';
    this.edges_material = new ShaderMaterial({
      uniforms: {
        _Thickness: { value: thickness },
        _Color: { value: new Color(color) }
      },
      vertexShader: edge_line_vert,
      fragmentShader: edge_line_frag,
      transparent: true,
      depthWrite: false
    });

    this.corners_material = new ShaderMaterial({
      uniforms: {
        _Thickness: { value: thickness },
        _Color: { value: new Color(color) }
      },
      vertexShader: corners_vert,
      fragmentShader: corners_frag,
      transparent: true,
      depthWrite: false
    });

    let edges_geometry    = this.__get_edges_geometry(this.__get_edges(buffer_geometry));
    let corners_geometry  = this.__get_corners_geometry(buffer_geometry.getAttribute('position'));

    this.edges_mesh   = new Mesh(edges_geometry, this.edges_material);
    this.corners_mesh = new Mesh(corners_geometry, this.corners_material);

    this.edges_mesh.frustumCulled = false;
    this.corners_mesh.frustumCulled = false;
    this.add(this.edges_mesh);
    this.add(this.corners_mesh);
  }

  __get_edges(cube_geometry)
  {
    let edges = new EdgesGeometry(cube_geometry);
    let line = new LineSegments(edges, new LineBasicMaterial());
    let points_array = line.geometry.attributes.position.array;

    let points = [];
    for (let i = 0; i < points_array.length; i += 3)
    {
      points.push(new Vector3(points_array[i], points_array[i + 1], points_array[i + 2]));
    }
    return points;
  }

  update(TIME)
  {

  }

  __get_edges_geometry(points)
  {
    let buffer_geometries = [];
    for (let i = 0; i < points.length; i += 2)
    {
      let dir = points[i + 1].clone().sub(points[i]).normalize();
      let geometry = new PlaneBufferGeometry(1, 1);
      let vertices = geometry.getAttribute('position');
      // top right
      vertices.array[0] = points[i].x;
      vertices.array[1] = points[i].y;
      vertices.array[2] = points[i].z;
      // top left
      vertices.array[3] = points[i].x;
      vertices.array[4] = points[i].y;
      vertices.array[5] = points[i].z;

      // bottom right
      vertices.array[6] = points[i + 1].x;
      vertices.array[7] = points[i + 1].y;
      vertices.array[8] = points[i + 1].z;
      // bottom left
      vertices.array[9] = points[i + 1].x;
      vertices.array[10] = points[i + 1].y;
      vertices.array[11] = points[i + 1].z;

      let dirs = [];
      for (let d = 0; d < vertices.count; d++)
      {
        dirs.push(dir.x);
        dirs.push(dir.y);
        dirs.push(dir.z);
      }
      let dir_array = new Float32Array(dirs);
      geometry.setAttribute('tangent', new BufferAttribute(dir_array, 3));
      buffer_geometries.push(geometry);
    }

    return BufferGeometryUtils.mergeBufferGeometries(buffer_geometries);
  }

  __get_corners_geometry(geometry_vertices)
  {
    let circle_buffer_geometries = [];
    for (let i = 0; i < geometry_vertices.count; i++)
    {
      let plane_geometry = new PlaneBufferGeometry(1, 1);
      let plane_vertices = plane_geometry.getAttribute('position');
      let w_pos = [];
      for (let d = 0; d < plane_vertices.count; d++)
      {
        w_pos.push(geometry_vertices.array[i * 3 + 0]);
        w_pos.push(geometry_vertices.array[i * 3 + 1]);
        w_pos.push(geometry_vertices.array[i * 3 + 2]);
      }
      let pos_array = new Float32Array(w_pos);
      plane_geometry.setAttribute('w_pos', new BufferAttribute(pos_array, 3));
      circle_buffer_geometries.push(plane_geometry);
    }
    return BufferGeometryUtils.mergeBufferGeometries(circle_buffer_geometries);
  }

  set_visible(boolean)
  {
    this.edges_mesh.visible = boolean;
    this.corners_mesh.visible = boolean;
  }

  dispose()
  {

  }
}
