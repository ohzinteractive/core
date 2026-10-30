import { type Node, NodeMaterial, type TextureNode } from 'three/webgpu';
declare class BlitNodeMaterial extends NodeMaterial {
    uniforms: {
        [uniform: string]: {
            value: any;
        };
    };
    uv_by_texture: Map<TextureNode, Node<"vec2">>;
    top_left_origin_by_texture: Map<TextureNode, Node<"bool">>;
    constructor();
    uv_for(texture_node: TextureNode): Node<"vec2">;
    texture_uv_at(texture_node: TextureNode, quad_uv: Node<'vec2'>): Node<"vec2">;
    sample(texture_node: TextureNode, offset?: Node<'vec2'>): TextureNode;
    sample_main_tex(offset?: Node<'vec2'>): TextureNode;
}
export { BlitNodeMaterial };
