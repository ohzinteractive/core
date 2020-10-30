import GeometryBatch from './GeometryBatch';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { Math as TMath } from 'three';
import { BufferAttribute } from 'three';

class GeometryBatcher
{
  constructor()
  {
    this.batches = [];
  }

  batch(buffer_geometries)
  {
    let attr_accessor_uvs = [];
    let texture_width = TMath.ceilPowerOfTwo(Math.sqrt(buffer_geometries.length));
    // console.log("Store count: " + buffer_geometries.length + ", Texture size: " +texture_width);

    this.__init_uv_array(attr_accessor_uvs, texture_width);

    let uv_index = 0;

    for (let i = 0; i < buffer_geometries.length; i++)
    {
      let vertex_count = buffer_geometries[i].getAttribute('position').count;
      let y = Math.floor(i / texture_width);
      let x = i - texture_width * y;
      for (let count = 0; count < vertex_count; count++)
      {
        attr_accessor_uvs[uv_index] = (x / texture_width) + 0.5 / texture_width;
        attr_accessor_uvs[uv_index + 1] = (y / texture_width) + 0.5 / texture_width;
        uv_index += 2;
      }
    }

    let buffer_attribute = new BufferAttribute(new Float32Array(attr_accessor_uvs), 2);
    let buffer_geometry = BufferGeometryUtils.mergeBufferGeometries(buffer_geometries);
    buffer_geometry.setAttribute('attr_accessor_uv', buffer_attribute);

    this.batches.push(new GeometryBatch(buffer_geometry, texture_width));
    return this.batches[this.batches.length - 1];
  }

  upload_texture_data(renderer)
  {
    for (let i = 0; i < this.batches.length; i++)
    {
      this.batches[i].upload_texture_data(renderer, 1);
    }
  }

  __init_uv_array(uvs, texture_width)
  {
    for (let i = 0; i < texture_width * texture_width * 2; i++)
    {
      uvs.push(0);
    }
  }
}

export default new GeometryBatcher();
