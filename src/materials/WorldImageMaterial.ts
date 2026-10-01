import type { Texture } from 'three';
import { DoubleSide, Vector3 } from 'three';
import { cameraProjectionMatrix, mix, modelViewMatrix, positionGeometry, texture, uniform, vec4 } from 'three/tsl';
import { NodeMaterial } from 'three/webgpu';

// Draws _MainTex on a WorldImage plane, with its alpha scaled by _Opacity. When
// _ScreenAligned is 1, the plane drops its rotation and faces the camera, scaled by
// _Scale instead of the mesh scale.
class WorldImageMaterial extends NodeMaterial
{
  uniforms: {
    _MainTex: { value: Texture },
    _ScreenAligned: { value: number },
    _Scale: { value: Vector3 },
    _Opacity: { value: number }
  };

  constructor(map: Texture)
  {
    super();

    const main_tex = texture(map);
    const screen_aligned = uniform(0);
    const scale = uniform(new Vector3(1, 1, 1));
    const opacity = uniform(1);

    this.uniforms = { _MainTex: main_tex, _ScreenAligned: screen_aligned, _Scale: scale, _Opacity: opacity };

    // Screen aligned, the rotation and scale columns of modelViewMatrix become
    // diag(_Scale) and only its translation is kept. Both positions are linear in the
    // matrix, so blending them equals blending the matrices.
    const world_aligned = modelViewMatrix.mul(vec4(positionGeometry, 1)).xyz;
    const camera_aligned = modelViewMatrix.element(3).xyz.add(positionGeometry.mul(scale));

    this.vertexNode = cameraProjectionMatrix.mul(vec4(mix(world_aligned, camera_aligned, screen_aligned), 1));

    this.fragmentNode = vec4(main_tex.rgb, main_tex.a.mul(opacity));

    this.transparent = true;
    this.depthWrite = false;
    this.side = DoubleSide;
  }
}

export { WorldImageMaterial };
