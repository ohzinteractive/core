import { Object3D } from 'three';
import { BufferAttribute } from 'three';
import { Points } from 'three';

export default class GPUParticleSystem extends Object3D
{
  constructor()
  {
    super();
    this.attributes = [];

    this.particles = undefined;
  }

  set_from_geometry(geometry, material, init_attribute_uvs)
  {
    // let position = new ParticlePositionAttribute("_Position");
    if (init_attribute_uvs && geometry.getAttribute('storage_uv') === undefined)
    {
      let uv_storage_attr = this.build_uv_storage_attribute(geometry.getAttribute('position').count);
      geometry.setAttribute('storage_uv', uv_storage_attr);
    }
    // position.init_from_geometry(geometry);
    // this.attributes.push(position);

    // material.uniforms._Position.value = position.read.texture;

    let points = new Points(geometry, material);
    points.frustumCulled = false;
    this.particles = points;

    this.add(points);
  }

  add_texture_attribute(buffer_attribute)
  {

  }

  add_attribute(name, buffer_attribute)
  {

  }

  build_uv_storage_attribute(particle_count)
  {
    let resolution = this.calculate_resolution(particle_count);
    let uvs = new Float32Array(particle_count * 2);
    for (var i = 0, j = 0; i < particle_count * 2; i += 2, j++)
    {
      uvs[i] = ((j % resolution) / resolution) + (0.5 / resolution);
      uvs[i + 1] = (Math.floor(j / resolution) / resolution) + (0.5 / resolution);
    }

    return new BufferAttribute(uvs, 2);
  }

  calculate_resolution(particle_count)
  {
    return Math.ceil(Math.sqrt(particle_count));
  }

  update()
  {
    for (let i = 0; i < this.attributes.length; i++)
    {
      this.attributes[i].update();
    }
  }

  set_attribute_update_material(attribute_name, mat)
  {
    for (let i = 0; i < this.attributes.length; i++)
    {
      if (this.attributes[i].name === attribute_name)
      {
        this.attributes[i].update_material = mat;
      }
    }
  }
}
