import { Graphics } from '../Graphics';

import { FloatType, HalfFloatType, LinearSRGBColorSpace, NearestFilter, RGBAFormat, WebGLRenderTarget } from 'three';
import { Capabilities } from '../Capabilities';

class ParticleAttribute
{
  constructor(attr_name, update_material)
  {
    this.read = undefined;
    this.write = undefined;

    this.name = attr_name;

    this.update_material = update_material;
  }

  init_from_geometry(geometry)
  {
    // overrided by inheritance
  }

  init_from_attribute(particle_attribute)
  {

  }

  build_RT(particle_count)
  {
    const resolution = ParticleAttribute.calculate_resolution(particle_count);
    const options = {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      colorSpace: LinearSRGBColorSpace,
      type: Capabilities.fp_textures_available ? FloatType : HalfFloatType,
      stencilBuffer: false,
      depthBuffer: false
    };

    return new WebGLRenderTarget(resolution.width, resolution.height, options);
  }

  static calculate_resolution(particle_count)
  {
    const width = Math.min(particle_count, 512);
    const height = Math.max(1, Math.ceil(particle_count / width));
    return { width, height };
  }

  swap_RT()
  {
    const tmp = this.read;
    this.read = this.write;
    this.write = tmp;
  }

  update(attribute_writter_scene)
  {
    if (this.update_material)
    {
      this.update_material.update();
      attribute_writter_scene.children[0].material = this.update_material;
      this.update_material.uniforms._MainTex.value = this.read.texture;
      Graphics.render(attribute_writter_scene, undefined, this.write);
      attribute_writter_scene.children[0].material = undefined;

      this.swap_RT();
    }
  }

  store_geometry_attribute_in_RT(attribute, RT, storage_material, attribute_writter_scene)
  {
    attribute_writter_scene.children[0].geometry.setAttribute('data', attribute);
    attribute_writter_scene.children[0].material = storage_material;

    Graphics.render(attribute_writter_scene, undefined, RT);

    attribute_writter_scene.children[0].geometry.deleteAttribute('data');
    attribute_writter_scene.children[0].material = undefined;
  }

  get_texture()
  {
    return this.read.texture;
  }
}

export { ParticleAttribute };
