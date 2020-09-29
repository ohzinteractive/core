import frag from '../shaders/write_view_position/write_view_position.frag';
import vert from '../shaders/write_view_position/write_view_position.vert';
import * as THREE from 'three';

export default class ViewPositionMaterial extends THREE.ShaderMaterial
{
  constructor()
  {
    super({
      uniforms: {
      },
      vertexShader: vert,
      fragmentShader: frag
    });
  }
}
