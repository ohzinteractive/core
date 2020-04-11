import BlitMaterial from '/materials/BlitMaterial';
import frag from '/shaders/unreal_blur/unreal_compose_frag';

export default class UnrealComposeMaterial extends BlitMaterial
{
	constructor(nMips)
	{
		let defines = {
			"NUM_MIPS": nMips
		}
		super(frag, undefined, defines);

		this.uniforms.blurTexture1 		= { value: null },
		this.uniforms.blurTexture2 		= { value: null },
		this.uniforms.blurTexture3 		= { value: null },
		this.uniforms.blurTexture4 		= { value: null },
		this.uniforms.blurTexture5 		= { value: null },
		this.uniforms.dirtTexture 		= { value: null },
		this.uniforms.bloomStrength 	= { value: 1.0 },
		this.uniforms.bloomFactors 		= { value: null },
		this.uniforms.bloomTintColors = { value: null },
		this.uniforms.bloomRadius 		= { value: 0.0 }
	}

}
