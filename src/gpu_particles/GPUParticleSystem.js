import { Object3D } from 'three';
import { BufferAttribute } from 'three';
import { PlaneGeometry } from 'three';
import { Mesh } from 'three';
import { BufferGeometry } from 'three';
import { Scene } from 'three';
import { Points } from 'three';
import { InstancedBufferGeometry } from 'three';
import { InstancedBufferAttribute } from 'three';
import ParticleAttribute from './ParticleAttribute';

export default class GPUParticleSystem extends Object3D
{
  constructor(particle_count, material)
  {
    super();
    this.attributes = [];

    this.mesh = this.build_point_mesh(particle_count, material);
    this.add(this.mesh);

    this.attribute_writter_mesh = this.build_attribute_writter_mesh(particle_count);
    this.attribute_writter_scene = new Scene();
    this.attribute_writter_scene.add(this.attribute_writter_mesh);
  }

  add_texture_attribute(buffer_attribute)
  {
    this.attributes.push(buffer_attribute);
  }

  add_update_attribute_array(name, array, item_size)
  {
    this.attribute_writter_mesh.geometry.setAttribute(name, new BufferAttribute(array, item_size, false));
  }

  add_attribute_array(name, array, item_size)
  {
    this.mesh.geometry.setAttribute(name, new InstancedBufferAttribute(array, item_size, false));
  }

  update()
  {
    this.mesh.material.update();
    for (let i = 0; i < this.attributes.length; i++)
    {
      this.attributes[i].update(this.attribute_writter_scene);
    }
  }

  dispose()
  {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }

  build_point_mesh(instance_count = 1, material)
  {
    const geo = new PlaneGeometry();

    const instanced_geo = new InstancedBufferGeometry();
    instanced_geo.setAttribute('position', geo.getAttribute('position'));
    instanced_geo.index = geo.index;

    instanced_geo.setAttribute('storage_uv', this.build_uv_storage_attribute(instance_count));
    instanced_geo.instanceCount = instance_count;
    const mesh = new Mesh(instanced_geo, material);
    mesh.frustumCulled = false;
    return mesh;
  }

  build_attribute_writter_mesh(particle_count)
  {
    const { width, height } = ParticleAttribute.calculate_resolution(particle_count);

    const uvs = new Float32Array(particle_count * 3);

    for (let i = 0; i < particle_count; i++)
    {
      const x = i % width;
      const y = Math.floor(i / width);
      uvs[i * 3 + 0] = (x + 0.5) / width;
      uvs[i * 3 + 1] = (y + 0.5) / height;
      uvs[i * 3 + 2] = i;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(uvs, 3, false));

    const points = new Points(geo);
    points.frustumCulled = false;
    return points;
  }

  build_uv_storage_attribute(particle_count)
  {
    const { width, height } = ParticleAttribute.calculate_resolution(particle_count);

    const uvs = new Float32Array(particle_count * 2);

    for (let i = 0; i < particle_count; i++)
    {
      const x = i % width;
      const y = Math.floor(i / width);
      uvs[i * 2 + 0] = (x + 0.5) / width;
      uvs[i * 2 + 1] = (y + 0.5) / height;
    }
    return new InstancedBufferAttribute(uvs, 2, false);
  }
}
