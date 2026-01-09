import type { ShaderMaterial } from 'three';
import { Mesh } from 'three';
import { RGBADataTexture } from '../data_textures/RGBADataTexture';
import { RGBAFloatDataTexture } from '../data_textures/RGBAFloatDataTexture';
import { RGBDataTexture } from '../data_textures/RGBDataTexture';
import { RGBFloatDataTexture } from '../data_textures/RGBFloatDataTexture';

class BatchedMesh extends Mesh
{
  batch_height: any;
  batch_width: any;
  batched_count: any;
  id_table: any;
  max_texture_width: any;
  material: ShaderMaterial;

  constructor(id_table: any, geometry: any, material: ShaderMaterial, max_texture_width: any)
  {
    super(geometry, material);

    this.id_table = id_table;
    this.batched_count = Object.keys(id_table).length;
    this.max_texture_width = max_texture_width;
    this.batch_width = this.batched_count % max_texture_width;
    this.batch_height = Math.ceil(this.batched_count / max_texture_width);
  }

  attach_rgb_texture(uniform_name: any)
  {
    this.material.uniforms[uniform_name].value = new RGBDataTexture(this.batch_width, this.batch_height);
  }

  attach_rgba_texture(uniform_name: any)
  {
    this.material.uniforms[uniform_name].value = new RGBADataTexture(this.batch_width, this.batch_height);
  }

  attach_rgb_float_texture(uniform_name: any)
  {
    this.material.uniforms[uniform_name].value = new RGBFloatDataTexture(this.batch_width, this.batch_height);
  }

  attach_rgba_float_texture(uniform_name: any)
  {
    this.material.uniforms[uniform_name].value = new RGBAFloatDataTexture(this.batch_width, this.batch_height);
  }

  get_mesh_index(name: any)
  {
    return this.id_table[name];
  }

  set_rgb_value(uniform_name: any, mesh_name: any, r: any, g: any, b: any)
  {
    // @ts-expect-error -- IGNORE --
    this.material.uniforms[uniform_name]?.set_rgb(this.get_mesh_index(mesh_name), r, g, b);
  }

  set_rgba_value(uniform_name: any, mesh_name: any, r: any, g: any, b: any, a: any)
  {
    // @ts-expect-error -- IGNORE --
    this.material.uniforms[uniform_name]?.set_rgba(this.get_mesh_index(mesh_name), r, g, b, a);
  }
}

export { BatchedMesh };
