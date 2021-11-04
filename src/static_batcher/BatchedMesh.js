import { Mesh } from 'three';
import RGBDataTexture from '../data_textures/RGBDataTexture';
import RGBADataTexture from '../data_textures/RGBADataTexture';
import RGBFloatDataTexture from '../data_textures/RGBFloatDataTexture';
import RGBAFloatDataTexture from '../data_textures/RGBAFloatDataTexture';

export default class BatchedMesh extends Mesh
{
  constructor(id_table, geometry, material, max_texture_width)
  {
    super(geometry, material);

    this.id_table = id_table;
    this.batched_count = Object.keys(id_table).length;
    this.max_texture_width = max_texture_width;
    this.batch_width = this.batched_count % max_texture_width;
    this.batch_height = Math.ceil(this.batched_count / max_texture_width);
  }

  attach_rgb_texture(uniform_name)
  {
    this.material.uniforms[uniform_name].value = new RGBDataTexture(this.batch_width, this.batch_height);
  }

  attach_rgba_texture(uniform_name)
  {
    this.material.uniforms[uniform_name].value = new RGBADataTexture(this.batch_width, this.batch_height);
  }

  attach_rgb_float_texture(uniform_name)
  {
    this.material.uniforms[uniform_name].value = new RGBFloatDataTexture(this.batch_width, this.batch_height);
  }

  attach_rgba_float_texture(uniform_name)
  {
    this.material.uniforms[uniform_name].value = new RGBAFloatDataTexture(this.batch_width, this.batch_height);
  }

  get_mesh_index(name)
  {
    return this.id_table[name];
  }

  set_rgb_value(uniform_name, mesh_name, r, g, b)
  {
    this.material.uniforms[uniform_name].set_rgb(this.get_mesh_index(mesh_name), r, g, b);
  }

  set_rgba_value(uniform_name, mesh_name, r, g, b, a)
  {
    this.material.uniforms[uniform_name].set_rgba(this.get_mesh_index(mesh_name), r, g, b, a);
  }
}
