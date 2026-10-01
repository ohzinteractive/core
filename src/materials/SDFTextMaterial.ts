import type { Texture } from 'three';
import { DoubleSide, LinearFilter, Vector2 } from 'three';
import { abs, attribute, cameraProjectionMatrix, cameraViewMatrix, clamp, dFdx, dFdy, float, length, mat4, max, min, positionGeometry, texture, uniform, uv, varying, vec2, vec4 } from 'three/tsl';
import { NodeMaterial } from 'three/webgpu';

import { OMath } from '../utilities/OMath';

// Draws the glyphs of an SDFTextBatch, one instance per glyph. The vertex stage scales
// and offsets the unit quad by plane_bounds, then places it with the instance matrix
// (transformsCol0..3). The fragment stage reads the glyph cell of the multi channel
// distance field atlas and turns the distance into coverage, about one pixel wide.
class SDFTextMaterial extends NodeMaterial
{
  uniforms: {
    _Texture: { value: Texture },
    _Boldness: { value: number },
    _AtlasSize: { value: Vector2 }
  };

  constructor(atlas: Texture)
  {
    super();

    const boldness = uniform(0.5);
    const atlas_size = uniform(new Vector2(1, 1));

    const plane_bounds = attribute('plane_bounds', 'vec4');
    const glyph_matrix = mat4(
      attribute('transformsCol0', 'vec4'),
      attribute('transformsCol1', 'vec4'),
      attribute('transformsCol2', 'vec4'),
      attribute('transformsCol3', 'vec4')
    );
    const glyph_position = vec4(positionGeometry.xy.mul(plane_bounds.zw).add(plane_bounds.xy), positionGeometry.z, 1);

    this.vertexNode = cameraProjectionMatrix.mul(cameraViewMatrix).mul(glyph_matrix).mul(glyph_position);

    // Glyph bounds are atlas pixels: left, right, top, bottom.
    const glyph_bounds = varying(attribute('glyph_bounds', 'vec4'));
    const color = varying(attribute('color', 'vec4'));

    const left = glyph_bounds.x.div(atlas_size.x);
    const right = glyph_bounds.y.div(atlas_size.x);
    const top = glyph_bounds.z.div(atlas_size.y);
    const bottom = glyph_bounds.w.div(atlas_size.y);
    const width = abs(right.sub(left));
    const height = abs(top.sub(bottom));

    const atlas_tex = texture(atlas, vec2(uv().x.mul(width).add(left), uv().y.mul(height).add(top).sub(height)));

    this.uniforms = { _Texture: atlas_tex, _Boldness: boldness, _AtlasSize: atlas_size };

    // The median of the three channels is the signed distance, 0.5 on the glyph edge.
    const signed_distance = max(min(atlas_tex.r, atlas_tex.g), min(max(atlas_tex.r, atlas_tex.g), atlas_tex.b));
    const distance = boldness.sub(signed_distance);
    // Distance to the edge in screen pixels. Where the atlas is flat (deep inside or far
    // outside a glyph) the gradient is 0. GLSL divided by it and relied on infinity,
    // which WGSL does not guarantee, so the gradient is kept above a tiny floor.
    const pixel_distance = distance.div(max(length(vec2(dFdx(distance), dFdy(distance))), 1e-6));
    const coverage = clamp(float(0.5).sub(pixel_distance), 0, 1);

    this.fragmentNode = vec4(color.rgb, coverage.mul(color.a));

    this.transparent = true;
    this.depthWrite = false;
    this.side = DoubleSide;
    // Node materials take scene fog by default. The GLSL material ignored it.
    this.fog = false;

    atlas.minFilter = LinearFilter;
    atlas.magFilter = LinearFilter;
    atlas.generateMipmaps = false;
  }

  set_atlas_size(size: Vector2)
  {
    this.uniforms._AtlasSize.value.copy(size);
  }

  set_boldness(value: number)
  {
    this.uniforms._Boldness.value = OMath.lerp(0.5, 0.2, value);
  }
}

export { SDFTextMaterial };
