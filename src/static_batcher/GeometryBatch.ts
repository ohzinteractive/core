import { DataTexture, FloatType, Mesh, RGBAFormat, ShaderMaterial, Vector2 } from 'three';

class GeometryBatch
{
  batch_width: any;
  data_textures: any;
  geometry: any;
  material: any;
  object_names: any;
  tmp_uploaded_data_count: any;
  uniform_dirty_count: any;
  uniforms: any;
  write_offset: any;
  zero_offset: any;
  constructor(geometry: any, batch_width: any)
  {
    this.geometry = geometry;

    this.material = undefined;
    this.uniforms = {};
    this.batch_width = batch_width;

    this.data_textures = [];

    this.object_names = undefined;

    this.zero_offset = new Vector2();
    this.write_offset = new Vector2();

    this.uniform_dirty_count = 0;

    this.tmp_uploaded_data_count = 0;
  }

  init(object_names: any, vert_shader: any, frag_shader: any)
  {
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert_shader,
      fragmentShader: frag_shader
    });
    this.object_names = object_names;
  }

  add_global_uniform(name: any, data: any)
  {
    this.uniforms[name] = { value: data };
    this.material.needsUpdate = true;
  }

  set_global_uniform(name: any, data: any)
  {
    this.uniforms[name].value = data;
  }

  add_object_uniform_v3(uniform_name: any, default_value_v3: any)
  {
    const src_tex       = this.__create_rgb_texture(this.batch_width);
    const dst_tex       = this.__create_rgb_texture(this.batch_width);
    const one_pixel_tex = this.__create_rgb_texture(1);

    const new_data_tex = this.__add_data_texture(uniform_name, src_tex, dst_tex, one_pixel_tex);

    if (default_value_v3)
    {
      this.__flood_data_texture_rgb(new_data_tex, default_value_v3);
    }
  }

  add_object_uniform_v4(uniform_name: any, default_value_v4: any)
  {
    const src_tex       = this.__create_rgba_texture(this.batch_width);
    const dst_tex       = this.__create_rgba_texture(this.batch_width);
    const one_pixel_tex = this.__create_rgba_texture(1);

    const new_data_tex = this.__add_data_texture(uniform_name, src_tex, dst_tex, one_pixel_tex);

    if (default_value_v4)
    {
      this.__flood_data_texture_rgba(new_data_tex, default_value_v4);
    }
  }

  add_object_uniform_v4_float(uniform_name: any, default_value_v4: any)
  {
    const src_tex       = this.__create_rgba_float_texture(this.batch_width);
    const dst_tex       = this.__create_rgba_float_texture(this.batch_width);
    const one_pixel_tex = this.__create_rgba_float_texture(1);

    const new_data_tex = this.__add_data_texture(uniform_name, src_tex, dst_tex, one_pixel_tex);

    if (default_value_v4)
    {
      this.__flood_data_texture_rgba(new_data_tex, default_value_v4);
    }
  }

  set_object_uniform_v3(object_name: any, uniform_name: any, vector3: any, use_r: any, use_g: any, use_b: any)
  {
    const obj_index = this.__get_object_index(object_name);
    const data_texture = this.__get_data_texture(uniform_name);

    this.__set_pixel_rgb(data_texture.src, obj_index, vector3, use_r, use_g, use_b);
    this.__set_pixel_rgb(data_texture.one_pixel, 0, vector3, use_r, use_g, use_b);

    data_texture.last_accessed_index = obj_index;

    data_texture.dirty_count++;
  }

  set_object_uniform_v4(object_name: any, uniform_name: any, vector4: any, use_r: any, use_g: any, use_b: any, use_a: any)
  {
    const obj_index = this.__get_object_index(object_name);
    const data_texture = this.__get_data_texture(uniform_name);

    this.__set_pixel_rgba(data_texture.src, obj_index, vector4, use_r, use_g, use_b, use_a);
    this.__set_pixel_rgba(data_texture.one_pixel, 0, vector4, use_r, use_g, use_b, use_a);
    data_texture.last_accessed_index = obj_index;

    data_texture.dirty_count++;
  }

  upload_texture_data(renderer: any, upload_budget: any)
  {
    for (let i = 0; i < this.data_textures.length; i++)
    {
      if (upload_budget > 0 && this.data_textures[i].dirty_count > 0)
      {
        if (this.data_textures[i].dirty_count === 1)
        {
          this.__partial_texture_data_upload(renderer, this.data_textures[i]);
        }
        if (this.data_textures[i].dirty_count > 1)
        {
          this.__full_texture_data_upload(renderer, this.data_textures[i]);
        }

        this.data_textures[i].dirty_count = 0;

        upload_budget--;
      }
    }
  }

  get_uniform_dirty_count()
  {
    this.uniform_dirty_count = 0;
    for (let i = 0; i < this.data_textures.length; i++)
    {
      if (this.data_textures[i].dirty_count > 0)
      {
        this.uniform_dirty_count++;
      }
    }
    return this.uniform_dirty_count;
  }

  __full_texture_data_upload(renderer: any, texture_data: any)
  {
    // console.log("full texture update of"+ texture_data.name);
    texture_data.dst.needsUpdate = true;
    renderer.copyTextureToTexture(
      this.zero_offset,
      texture_data.src,
      texture_data.dst
    );
  }

  __partial_texture_data_upload(renderer: any, texture_data: any)
  {
    // console.log("partial texture update"+ texture_data.name);
    const index = texture_data.last_accessed_index;
    if (index === -1)
    {
      return;
    }

    this.write_offset.y = Math.floor(index / this.batch_width);
    this.write_offset.x = index - this.batch_width * this.write_offset.y;
    renderer.copyTextureToTexture(
      this.write_offset,
      texture_data.one_pixel,
      texture_data.dst
    );
  }

  get_mesh()
  {
    return new Mesh(this.geometry, this.material);
  }

  __set_pixel_rgb(data_texture: any, index: any, vector3: any, use_r: any, use_g: any, use_b: any)
  {
    if (use_r)
    {
      data_texture.image.data[index * 3 + 0] = vector3.x;
    }
    if (use_g)
    {
      data_texture.image.data[index * 3 + 1] = vector3.y;
    }
    if (use_b)
    {
      data_texture.image.data[index * 3 + 2] = vector3.z;
    }
  }

  __set_pixel_rgba(data_texture: any, index: any, vector4: any, use_r: any, use_g: any, use_b: any, use_a: any)
  {
    if (use_r)
    {
      data_texture.image.data[index * 4 + 0] = vector4.x;
    }
    if (use_g)
    {
      data_texture.image.data[index * 4 + 1] = vector4.y;
    }
    if (use_b)
    {
      data_texture.image.data[index * 4 + 2] = vector4.z;
    }
    if (use_a)
    {
      data_texture.image.data[index * 4 + 3] = vector4.w;
    }
  }

  __flood_data_texture_rgb(data_texture: any, v3: any)
  {
    for (let i = 0; i < this.batch_width * this.batch_width; i++)
    {
      this.__set_pixel_rgb(data_texture.src, i, v3, true, true, true);
      data_texture.dirty_count++;
    }
  }

  __flood_data_texture_rgba(data_texture: any, v4: any)
  {
    for (let i = 0; i < this.batch_width * this.batch_width; i++)
    {
      this.__set_pixel_rgba(data_texture.src, i, v4, true, true, true, true);
      data_texture.dirty_count++;
    }
  }

  __create_rgb_texture(width: any)
  {
    const data = new Uint8Array(3 * width * width);
    return new DataTexture(data, width, width, RGBAFormat);
  }

  __create_rgba_texture(width: any)
  {
    const data = new Uint8Array(4 * width * width);
    return new DataTexture(data, width, width, RGBAFormat);
  }

  __create_rgba_float_texture(width: any)
  {
    const data = new Float32Array(4 * width * width);
    return new DataTexture(data, width, width, RGBAFormat, FloatType);
  }

  __get_data_texture(uniform_name: any)
  {
    for (let i = 0; i < this.data_textures.length; i++)
    {
      if (this.data_textures[i].name === uniform_name)
      {
        return this.data_textures[i];
      }
    }
    console.error('Data texture ' + uniform_name + ' does not exist');
    return undefined;
  }

  __get_object_index(name: any)
  {
    for (let i = 0; i < this.object_names.length; i++)
    {
      if (this.object_names[i] === name)
      {
        return i;
      }
    }
    console.error('the name ' + name + ' is not contained in this batch');
    return undefined;
  }

  __add_data_texture(uniform_name: any, src_texture: any, dst_texture: any, one_pixel_text: any)
  {
    dst_texture.needsUpdate = true;

    this.data_textures.push({
      name: uniform_name,
      src: src_texture,
      dst: dst_texture,
      one_pixel: one_pixel_text,
      last_accessed_index: -1,
      dirty_count: 0
    });

    this.uniforms[uniform_name] = { value: dst_texture };
    return this.data_textures[this.data_textures.length - 1];
  }

  dispose()
  {
    for (let i = 0; i < this.data_textures.length; i++)
    {
      this.data_textures[i].src.dispose();
      this.data_textures[i].dst.dispose();
      this.data_textures[i].one_pixel.dispose();
    }
  }
}

export { GeometryBatch };
