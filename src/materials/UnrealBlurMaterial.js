import BlitMaterial from '/materials/BlitMaterial';
import frag from '/shaders/unreal_blur/unreal_blur_frag';

export default class UnrealBlurMaterial extends BlitMaterial
{
	constructor(kernel_radius)
	{
		let defines = {
			"KERNEL_RADIUS": kernel_radius,
			"SIGMA": kernel_radius
		}
		super(frag, undefined, defines);
		this.uniforms._SampleDir = { value: new THREE.Vector2(0.5, 0.5)};
	}

}
