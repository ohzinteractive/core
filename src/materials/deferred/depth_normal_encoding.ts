import { dot, float, fract, Fn, vec2, vec3 } from 'three/tsl';
import type { Node } from 'three/webgpu';

// Packing shared by DepthAndNormalsRenderer and its consumers: depth01 goes in RG,
// the view space normal in BA. Each value spreads over two 8 bit channels.

const NORMAL_SCALE = 1.7777;

// Splits a [0, 1) float over two channels. 1.0 itself wraps around to 0.
const encode_float_rg = Fn(([value]: [Node<'float'>]) =>
{
  const encoded = fract(vec2(1, 255).mul(value));

  return vec2(encoded.x.sub(encoded.y.div(255)), encoded.y);
});

const decode_float_rg = Fn(([encoded]: [Node<'vec2'>]) =>
{
  return dot(encoded, vec2(1, 1 / 255));
});

// Stereographic projection of a unit normal onto two channels.
const encode_normal = Fn(([normal]: [Node<'vec3'>]) =>
{
  return normal.xy.div(normal.z.add(1)).div(NORMAL_SCALE).mul(0.5).add(0.5);
});

const decode_normal = Fn(([encoded]: [Node<'vec2'>]) =>
{
  const projected = vec3(encoded.mul(2 * NORMAL_SCALE).sub(NORMAL_SCALE), 1);
  const g = float(2).div(dot(projected, projected));

  return vec3(projected.xy.mul(g), g.sub(1));
});

export { decode_float_rg, decode_normal, encode_float_rg, encode_normal };
