import basic_texture_vert from '../shaders/basic_texture/basic_texture.vert';
import basic_texture_frag from '../shaders/basic_texture/basic_texture.frag';

import { Mesh } from 'three';
import { Vector2 } from 'three';
import { ShaderMaterial } from 'three';
import { DoubleSide } from 'three';
import { PlaneGeometry } from 'three';
import { Vector3 } from 'three';

export default class WorldImage extends Mesh
{
  constructor(texture, pivot)
  {
    pivot = pivot || new Vector2(0, 0);
    let material = new ShaderMaterial({
      uniforms: {
        _MainTex: { value: texture },
        _ScreenAligned: { value: 0 },
        _Scale: { value: 1 }
      },
      vertexShader: basic_texture_vert,
      fragmentShader: basic_texture_frag,
      transparent: true,
      depthWrite: false,
      side: DoubleSide
    });
    let geometry = new PlaneGeometry(1, 1, 1);
    geometry.translate(-pivot.x / 2, -pivot.y / 2, 0);
    let current_scale = texture.image.width / texture.image.height;
    geometry.scale(current_scale, 1, 1);
    super(geometry, material);
    this.current_scale = current_scale;
    this.geometry.computeBoundingBox();

    this.tmp_bb_size = new Vector3();
    this.geometry.boundingBox.getSize(this.tmp_bb_size);
  }

  update_texture()
  {
    this.material.uniforms._MainTex.value.needsUpdate = true;
    let img = this.material.uniforms._MainTex.value.image;

    this.geometry.scale(1 / this.current_scale, 1, 1);
    this.current_scale = img.width / img.height;
    this.geometry.scale(this.current_scale, 1, 1);
    this.geometry.computeBoundingBox();
    this.geometry.boundingBox.getSize(this.tmp_bb_size);
  }

  get size()
  {
    return this.tmp_bb_size.clone().multiplyScalar(this.scale.x);
  }

  set size(value)
  {
    this.scale.set(value, value, value);
    this.material.uniforms._Scale.value = value;
  }

  set screen_aligned(boolean)
  {
    this.material.uniforms._ScreenAligned.value = boolean === true ? 1 : 0;
  }

  dispose()
  {
    this.geometry.dispose();
    this.parent.remove(this);
    this.material.uniforms._MainTex.value.dispose();
    this.material.dispose();
  }
}
