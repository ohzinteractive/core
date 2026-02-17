import { Graphics } from '../Graphics';
import { MedianFilterMaterial } from '../materials/MedianFilterMaterial';

import { FloatType, NearestFilter, RenderTarget, RGBAFormat, Vector2 } from 'three';

class MedianFilter
{
  RT: RenderTarget;
  RT1: RenderTarget;
  median_filter_mat: MedianFilterMaterial;

  constructor()
  {
    this.RT = new RenderTarget(1, 1, {
      type: FloatType,
      format: RGBAFormat,
      minFilter: NearestFilter,
      magFilter: NearestFilter
    });
    this.RT1 = new RenderTarget(1, 1, {
      type: FloatType,
      format: RGBAFormat,
      minFilter: NearestFilter,
      magFilter: NearestFilter
    });

    this.median_filter_mat = new MedianFilterMaterial();
  }

  filter(texture: any)
  {
    const tex_size = this.get_size(texture);
    if (tex_size.x !== this.RT.width || tex_size.y !== this.RT.height)
    {
      this.RT.setSize(tex_size.x, tex_size.y);
      this.RT1.setSize(tex_size.x, tex_size.y);
    }

    this.median_filter_mat.set_texture(texture);
    Graphics.material_pass(this.median_filter_mat, this.RT);

    for (let i = 0; i < 0; i++)
    {
      this.median_filter_mat.set_texture(this.RT.texture);
      Graphics.material_pass(this.median_filter_mat, this.RT1);

      this.median_filter_mat.set_texture(this.RT1.texture);
      Graphics.material_pass(this.median_filter_mat, this.RT);
    }

    return this.RT;
  }

  get_size(tex: any)
  {
    if (tex.isVideoTexture)
    {
      return new Vector2(Math.max(1, tex.image.videoWidth), Math.max(1, tex.image.videoHeight));
    }
    if (tex.isRenderTarget)
    {
      return new Vector2(tex.width, tex.height);
    }
    if (tex.isTexture)
    {
      return new Vector2(tex.image.width, tex.image.height);
    }
    return new Vector2(1, 1);
  }
}

export { MedianFilter };
