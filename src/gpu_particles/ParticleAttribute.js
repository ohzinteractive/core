import Graphics from '../Graphics';

import { Scene } from 'three';
import { NearestFilter } from 'three';
import { RGBAFormat } from 'three';
import { LinearEncoding } from 'three';
import { HalfFloatType } from 'three';
import { FloatType } from 'three';
import { WebGLRenderTarget } from 'three';
import { Points } from 'three';

export default class ParticleAttribute
{
  constructor(attr_name)
  {
    this.read = undefined;
    this.write = undefined;

    this.name = attr_name;

    this.update_material = undefined;

    this.update_scene = new Scene();
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
    const resolution = this.calculate_resolution(particle_count);
    const options = {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      encoding: LinearEncoding,
      type: (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) ? HalfFloatType : FloatType,
      stencilBuffer: false,
      depthBuffer: false
    };

    return new WebGLRenderTarget(resolution, resolution, options);
  }

  calculate_resolution(particle_count)
  {
    return Math.ceil(Math.sqrt(particle_count));
  }

  swap_RT()
  {
    const tmp = this.read;
    this.read = this.write;
    this.write = tmp;
  }

  update()
  {
    if (this.update_material)
    {
      Graphics.blit(this.read, this.write, this.update_material);
      this.swap_RT();
    }
  }

  render_geometry_to_RT(geometry, material, RT)
  {
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    // let scene = new Scene();
    // scene.add( points );
    this.update_scene.add(points);
    Graphics.render(this.update_scene, undefined, RT);
    // Graphics.render(scene, undefined, RT);
  }
}
