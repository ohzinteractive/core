import { BlitNodeMaterial } from '../materials/BlitNodeMaterial';
import { decode_float_rg, decode_normal } from './deferred/depth_normal_encoding';

import { DataTexture, Matrix4, RGBAFormat, RepeatWrapping, Vector3 } from 'three';
import { abs, clamp, cross, dot, float, floor, Fn, ivec2, Loop, mix, normalize, smoothstep, step, texture, uniform, uniformArray, uv, vec2, vec3, vec4 } from 'three/tsl';
import type { Node, TextureNode } from 'three/webgpu';

import { OMath } from '../utilities/OMath';

const KERNEL_SIZE = 64;
const NOISE_SIZE = 4;

// Screen space ambient occlusion over the DepthAndNormalsRenderer target (_MainTex).
// Each pixel tests a hemisphere of samples around its normal against the depth
// buffer and writes the occluded fraction to every channel.
// use_exact_depth picks how samples read depth between texels: exact (default) or
// one filtered fetch, which costs about half as much but bands flat surfaces.
class SSAOMaterial extends BlitNodeMaterial
{
  sample_kernel: Vector3[];
  use_exact_depth: boolean;

  constructor(use_exact_depth = true)
  {
    super();

    this.sample_kernel = this.__get_sample_kernel();
    this.use_exact_depth = use_exact_depth;

    const inverse_proj = uniform(new Matrix4());
    const projection = uniform(new Matrix4());
    const bias = uniform(0.0125);
    const radius = uniform(0.3);
    const kernel = uniformArray<'vec3'>(this.sample_kernel, 'vec3');
    const random_rotation = texture(this.__get_rotation_texture());

    Object.assign(this.uniforms, {
      _InverseProjMatrix: inverse_proj,
      _ProjectionMatrix: projection,
      _Bias: bias,
      _Radius: radius,
      _SampleKernel: kernel,
      _RandomRotation: random_rotation
    });

    const depth_normal_tex = this.uniforms._MainTex as TextureNode;
    const resolution = this.uniforms._Resolution as unknown as Node<'vec2'>;

    // Bilinear depth, decoded per texel before interpolating. The texture filter returns
    // 8 bit channels with only a few extra bits, which the RG packing scales by 255
    // wherever the high byte steps, enough to self occlude flat surfaces in lines.
    const exact_depth_at = (texture_uv: Node<'vec2'>) =>
    {
      const texel_pos = texture_uv.mul(resolution).sub(0.5);
      const corner = floor(texel_pos);
      const weight = texel_pos.sub(corner);
      const last_texel = resolution.sub(1);

      const texel_depth = (x: number, y: number) =>
      {
        const texel = clamp(corner.add(vec2(x, y)), vec2(0), last_texel);

        return decode_float_rg(depth_normal_tex.load(ivec2(texel)).xy);
      };

      return mix(
        mix(texel_depth(0, 0), texel_depth(1, 0), weight.x),
        mix(texel_depth(0, 1), texel_depth(1, 1), weight.x),
        weight.y
      );
    };

    const filtered_depth_at = (texture_uv: Node<'vec2'>) => decode_float_rg(depth_normal_tex.sample(texture_uv).xy);

    const depth_at = use_exact_depth ? exact_depth_at : filtered_depth_at;

    // Scales the far plane point under quad_uv by the stored depth over the far plane.
    const view_position_at = (quad_uv: Node<'vec2'>) =>
    {
      const far_plane_point = inverse_proj.mul(vec4(quad_uv.mul(2).sub(1), 1, 1));
      const depth = depth_at(this.texture_uv_at(depth_normal_tex, quad_uv));

      return far_plane_point.xyz.div(far_plane_point.w).mul(depth);
    };

    this.fragmentNode = Fn(() =>
    {
      const frag_pos = view_position_at(uv()).toVar();
      const normal = normalize(decode_normal(this.sample_main_tex().zw)).toVar();

      // The noise tiles once every NOISE_SIZE pixels.
      const random_xy = random_rotation.sample(uv().mul(resolution.div(NOISE_SIZE))).xy.mul(2).sub(1);
      const random_vec = normalize(vec3(random_xy, 0));

      const tangent = normalize(random_vec.sub(normal.mul(dot(random_vec, normal)))).toVar();
      const bitangent = normalize(cross(normal, tangent)).toVar();

      const occlusion = float(0).toVar();

      Loop(KERNEL_SIZE, ({ i }) =>
      {
        const offset = vec3(kernel.element(i));
        const sample_pos = frag_pos.add(tangent.mul(offset.x).add(bitangent.mul(offset.y)).add(normal.mul(offset.z)).mul(radius));

        const clip_pos = projection.mul(vec4(sample_pos, 1));
        const sample_uv = clip_pos.xy.div(clip_pos.w).mul(0.5).add(0.5);
        const sampled_depth = view_position_at(sample_uv).z;

        const range_check = smoothstep(0, 1, radius.div(abs(frag_pos.z.sub(sampled_depth))));

        occlusion.addAssign(step(sample_pos.z.add(bias), sampled_depth).mul(range_check));
      });

      return vec4(vec3(occlusion.div(KERNEL_SIZE)), 1);
    })();
  }

  set_projection_matrix(projection_matrix: Matrix4)
  {
    (this.uniforms._ProjectionMatrix.value as Matrix4).copy(projection_matrix);
    (this.uniforms._InverseProjMatrix.value as Matrix4).copy(projection_matrix).invert();
  }

  __get_sample_kernel()
  {
    const sample_kernel = [];

    for (let i = 0; i < KERNEL_SIZE; i++)
    {
      const dir = new Vector3(Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random());
      dir.normalize();
      let scale = i / KERNEL_SIZE;
      scale   = OMath.lerp(0.1, 1.0, scale * scale);
      dir.multiplyScalar(scale);

      sample_kernel.push(dir);
    }
    return sample_kernel;
  }

  // Random xy in RG, no z, so the kernel only spins around the normal.
  __get_rotation_texture()
  {
    const rotation_kernel = new Uint8Array(4 * NOISE_SIZE * NOISE_SIZE);
    for (let i = 0; i < NOISE_SIZE * NOISE_SIZE; i++)
    {
      rotation_kernel[i * 4 + 0] = Math.floor(Math.random() * 255);
      rotation_kernel[i * 4 + 1] = Math.floor(Math.random() * 255);
      rotation_kernel[i * 4 + 2] = 0;
      rotation_kernel[i * 4 + 3] = 255;
    }

    const rotation_texture = new DataTexture(rotation_kernel, NOISE_SIZE, NOISE_SIZE, RGBAFormat);
    rotation_texture.wrapS = RepeatWrapping;
    rotation_texture.wrapT = RepeatWrapping;

    rotation_texture.needsUpdate = true;
    return rotation_texture;
  }
}

export { SSAOMaterial };
