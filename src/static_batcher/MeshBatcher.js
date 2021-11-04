import BatchedMesh from './BatchedMesh';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { BufferAttribute } from 'three';

export default class MeshBatcher
{
  batch(meshes, material)
  {
    let max_texture_width = 2048;
    // let texture_width  = meshes.length % max_texture_width;
    // let texture_height = Math.ceil(meshes.length / max_texture_width);

    // console.log("Store count: " + buffer_geometries.length + ", Texture size: " +texture_width);

    let geometries = [];
    let id_table = {};

    let attr_mesh_id = [];

    for (let i = 0; i < meshes.length; i++)
    {
      let mesh = meshes[i];
      let vertex_count = mesh.geometry.getAttribute('position').count;

      for (let count = 0; count < vertex_count; count++)
      {
        attr_mesh_id.push(i);
      }

      geometries.push(mesh.geometry);

      if (id_table[mesh.name] === undefined)
      {
        id_table[mesh.name] = i;
      }
      else
      {
        console.error('Mesh name is duplicated when trying to merge meshes. Non-unique id error.', mesh.name, id_table);
      }
    }

    let buffer_geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);

    let buffer_attribute = new BufferAttribute(new Float32Array(attr_mesh_id), 1);
    buffer_geometry.setAttribute('mesh_id', buffer_attribute);

    return this.create_batched_mesh(id_table, buffer_geometry, material, max_texture_width);
  }

  create_batched_mesh(id_table, buffer_geometry, material, max_texture_width)
  {
    return new BatchedMesh(id_table, buffer_geometry, material, max_texture_width);
  }
}
