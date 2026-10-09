import { WorldImageMaterial } from '../materials/WorldImageMaterial';

import type { Texture } from 'three';
import { Mesh, PlaneGeometry, Vector2, Vector3 } from 'three';

class WorldImage extends Mesh
{
  current_scale: number;
  sized_texture: Texture;
  texture_size: Vector2;
  tmp_bb_size: Vector3;
  material: WorldImageMaterial;
  
  constructor(texture: Texture, pivot: Vector2)
  {
    pivot = pivot || new Vector2(0, 0);
    const material = new WorldImageMaterial(texture);
    const geometry = new PlaneGeometry(1, 1, 1);
    geometry.translate(-pivot.x / 2, -pivot.y / 2, 0);
    // @ts-expect-error -- threejs issue
    const current_scale = texture.image.width / texture.image.height;
    geometry.scale(current_scale, 1, 1);
    super(geometry, material);
    this.current_scale = current_scale;
    this.sized_texture = texture;
    // @ts-expect-error -- threejs issue
    this.texture_size = new Vector2(texture.image.width, texture.image.height);
    this.geometry.computeBoundingBox();

    this.tmp_bb_size = new Vector3();
    this.geometry.boundingBox.getSize(this.tmp_bb_size);
    this.material = material;
  }

  update_texture()
  {
    const texture = this.material.uniforms._MainTex.value;
    const img = texture.image as { width: number, height: number };

    // WebGPURenderer allocates the GPU texture at the image size once and later only
    // uploads into it, so an image that changed size needs a new one. A texture swapped
    // into _MainTex may be shared, so it is only measured, never freed.
    const resized = img.width !== this.texture_size.x || img.height !== this.texture_size.y;

    if (texture === this.sized_texture && resized)
    {
      texture.dispose();
    }
    this.sized_texture = texture;
    this.texture_size.set(img.width, img.height);
    texture.needsUpdate = true;

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
    this.material.uniforms._Scale.value.copy(value);
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

    super.dispose();
  }
}

export { WorldImage };
