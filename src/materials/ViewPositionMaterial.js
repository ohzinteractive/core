import frag from '/shaders/write_view_position/write_view_position_frag';
import vert from '/shaders/write_view_position/write_view_position_vert';

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
