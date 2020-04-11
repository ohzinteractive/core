import frag from '../../shaders/gpu_particles/generic_storage_frag';
import common_utils from '../../shaders/gpu_particles/common_utils';
export default class ParticleStorageMaterial extends THREE.ShaderMaterial
{
	constructor(vert)
	{
		THREE.ShaderChunk["gpu_particles_utils"] = common_utils;

		super({
			uniforms: {

			},
			vertexShader: vert,
			fragmentShader: frag,
			depthWrite: false,
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
      depthFunc: THREE.AlwaysDepth
		});
	}
}
