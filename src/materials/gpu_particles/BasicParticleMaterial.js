import vert from '/shaders/gpu_particles/visualize/visualize_vert';
import frag from '/shaders/gpu_particles/visualize/visualize_frag';
import common_utils from '/shaders/gpu_particles/common_utils';

export default class BasicParticleMaterial extends THREE.ShaderMaterial
{
	constructor()
	{
		// THREE.ShaderChunk["gpu_particles_utils"] = common_utils;

		super({
			uniforms: {
				_Position: {value: undefined},
				_Time: {value: 0}
			},
			vertexShader: vert,
			fragmentShader: frag,
			transparent: true,
			depthWrite: false
		});
	}
}
