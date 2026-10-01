import { NoBlending, Texture, Vector2 } from 'three';
import { positionGeometry, texture, uniform, uv, vec4 } from 'three/tsl';
import { type Node, NodeMaterial } from 'three/webgpu';

type TextureNode = ReturnType<typeof texture>;
type TextureKind = Texture & { isRenderTargetTexture?: boolean, isFramebufferTexture?: boolean, isDepthTexture?: boolean };

// Same textures three's TextureNode treats as top left origin on both backends.
function has_top_left_origin(value: TextureKind): boolean
{
  return value.isRenderTargetTexture === true || value.isFramebufferTexture === true || value.isDepthTexture === true;
}

// TSL counterpart of BlitMaterial for the WebGPURenderer (WebGPU and WebGL2 backends).
// Uniforms are TSL nodes stored under the same names as BlitMaterial, and every node
// exposes `.value`, so Blitter and render modes drive both materials the same way.
class BlitNodeMaterial extends NodeMaterial
{
  uniforms: { [uniform: string]: { value: any } };
  uv_by_texture = new Map<TextureNode, Node<'vec2'>>();

  constructor()
  {
    super();

    this.uniforms = {
      _MainTex: texture(new Texture()),
      _Resolution: uniform(new Vector2(0, 0)),
      _TargetResolution: uniform(new Vector2(0, 0))
    };

    // Blitter draws a 1x1 PlaneGeometry, stretched here to cover clip space.
    this.vertexNode = vec4(positionGeometry.xy.mul(2), 0, 1);
    this.fragmentNode = this.sample_main_tex();

    this.depthWrite = false;
    this.depthTest = false;
    this.blending = NoBlending;
  }

  // PlaneGeometry UVs start at the bottom left, which matches regular textures.
  // Render targets are sampled with a top left origin, so their UVs are flipped.
  // Decided per draw, since the same material blits both kinds.
  uv_for(texture_node: TextureNode)
  {
    let texture_uv = this.uv_by_texture.get(texture_node);

    if (texture_uv === undefined)
    {
      const top_left_origin = uniform(false).onObjectUpdate(() => has_top_left_origin(texture_node.value as TextureKind));

      texture_uv = top_left_origin.select(uv().flipY(), uv());
      this.uv_by_texture.set(texture_node, texture_uv);
    }

    return texture_uv;
  }

  sample(texture_node: TextureNode, offset?: Node<'vec2'>)
  {
    const base_uv = this.uv_for(texture_node);

    return texture_node.sample(offset ? base_uv.add(offset) : base_uv);
  }

  sample_main_tex(offset?: Node<'vec2'>)
  {
    return this.sample(this.uniforms._MainTex as TextureNode, offset);
  }
}

export { BlitNodeMaterial };
