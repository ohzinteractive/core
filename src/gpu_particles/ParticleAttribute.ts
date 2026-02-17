import { Graphics } from '../Graphics';

import type { BufferAttribute, BufferGeometry, Scene } from 'three';
import { FloatType, HalfFloatType, Mesh, NearestFilter, NoColorSpace, RenderTarget, RGBAFormat } from 'three';
import { Capabilities } from '../Capabilities';

class ParticleAttribute
{
  name: any;
  read: RenderTarget;
  update_material: any;
  write: RenderTarget;

  constructor(attr_name: string, update_material: any)
  {
    this.read = undefined;
    this.write = undefined;

    this.name = attr_name;

    this.update_material = update_material;
  }

  init_from_geometry(geometry: BufferGeometry)
  {
    // overrided by inheritance
  }

  init_from_attribute(particle_attribute: ParticleAttribute)
  {

  }

  build_RT(particle_count: number)
  {
    const resolution = ParticleAttribute.calculate_resolution(particle_count);
    const options = {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      colorScape: NoColorSpace,
      type: Capabilities.fp_textures_available ? FloatType : HalfFloatType,
      stencilBuffer: false,
      depthBuffer: false
    };

    return new RenderTarget(resolution.width, resolution.height, options);
  }

  static calculate_resolution(particle_count: number)
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

  update(attribute_writter_scene: Scene)
  {
    if (this.update_material)
    {
      this.update_material.update();

      if (attribute_writter_scene.children[0] instanceof Mesh)
      {
        attribute_writter_scene.children[0].material = this.update_material;
      }

      this.update_material.uniforms._MainTex.value = this.read.texture;
      Graphics.render(attribute_writter_scene, undefined, this.write);

      if (attribute_writter_scene.children[0] instanceof Mesh)
      {
        attribute_writter_scene.children[0].material = undefined;
      }

      this.swap_RT();
    }
  }

  store_geometry_attribute_in_RT(attribute: BufferAttribute, RT: RenderTarget, storage_material: any, attribute_writter_scene: Scene)
  {
    if (attribute_writter_scene.children[0] instanceof Mesh)
    {
      attribute_writter_scene.children[0].geometry.setAttribute('data', attribute);
      attribute_writter_scene.children[0].material = storage_material;
    }

    Graphics.render(attribute_writter_scene, undefined, RT);

    if (attribute_writter_scene.children[0] instanceof Mesh)
    {
      attribute_writter_scene.children[0].geometry.deleteAttribute('data');
      attribute_writter_scene.children[0].material = undefined;
    }
  }

  get_texture()
  {
    return this.read.texture;
  }
}

export { ParticleAttribute };
