import type { Node } from 'three/webgpu';
declare const encode_float_rg: import("three/src/nodes/TSL.js").FnNode<[number | Node<"uint"> | Node<"float">], import("three/webgpu").VarNode<"vec2", import("three/webgpu").JoinNode<"vec2">>>;
declare const decode_float_rg: import("three/src/nodes/TSL.js").FnNode<[import("three").Vector2 | Node<"vec2">], Node<"float">>;
declare const encode_normal: import("three/src/nodes/TSL.js").FnNode<[import("three").Vector3 | Node<"vec3">], Node<"vec2">>;
declare const decode_normal: import("three/src/nodes/TSL.js").FnNode<[import("three").Vector2 | Node<"vec2">], import("three/webgpu").VarNode<"vec3", import("three/webgpu").JoinNode<"vec3">>>;
export { decode_float_rg, decode_normal, encode_float_rg, encode_normal };
