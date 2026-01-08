// @ts-check
// @ts-ignore
import basic_texture_vert from '../shaders/basic_texture/basic_texture.vert';
// @ts-ignore
import basic_texture_frag from '../shaders/basic_texture/basic_texture.frag';

import { Mesh, Texture } from 'three'; // eslint-disable-line no-unused-vars
import { Vector2 } from 'three';
import { ShaderMaterial } from 'three';
import { DoubleSide } from 'three';
import { PlaneGeometry } from 'three';
import { Vector3 } from 'three';

class WorldImage extends Mesh
{
  /**
   * @param {Texture} texture
   * @param {Vector2} [pivot]
   */
  constructor(texture, pivot)
  {
    pivot = pivot || new Vector2(0, 0);
    const material = new ShaderMaterial({
      uniforms: {
        _MainTex: { value: texture },
        _ScreenAligned: { value: 0 },
        _Scale: { value: 1 },
        _Opacity: { value: 1 }
      },
      vertexShader: basic_texture_vert,
      fragmentShader: basic_texture_frag,
      transparent: true,
      depthWrite: false,
      side: DoubleSide
    });
    const geometry = new PlaneGeometry(1, 1, 1);
    geometry.translate(-pivot.x / 2, -pivot.y / 2, 0);
    const current_scale = texture.image.width / texture.image.height;
    geometry.scale(current_scale, 1, 1);
    super(geometry, material);
    this.current_scale = current_scale;
    this.geometry.computeBoundingBox();

    this.tmp_bb_size = new Vector3();
    this.geometry.boundingBox.getSize(this.tmp_bb_size);
    this.material = material;
  }

  update_texture()
  {
    this.material.uniforms._MainTex.value.needsUpdate = true;
    const img = this.material.uniforms._MainTex.value.image;

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
    this.scale.copy(value);
    this.material.uniforms._Scale.value = value;
  }

  set screen_aligned(boolean)
  {
    this.material.uniforms._ScreenAligned.value = boolean === true ? 1 : 0;
  }

  get screen_aligned()
  {
    return this.material.uniforms._ScreenAligned.value === 1;
  }

  set opacity(opacity)
  {
    this.material.uniforms._Opacity.value = opacity;
  }

  get opacity()
  {
    return this.material.uniforms._Opacity.value;
  }

  dispose()
  {
    this.geometry.dispose();
    this.parent.remove(this);
    this.material.uniforms._MainTex.value.dispose();
    this.material.dispose();
  }
}

export { WorldImage };
