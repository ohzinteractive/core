import BlitMaterial from '/materials/BlitMaterial';
import frag from '/shaders/box_blur/box_blur_frag';

export default class BoxBlurMaterial extends BlitMaterial
{
	constructor()
	{
		super(frag);
		this.uniforms._SampleDir = { value: new THREE.Vector2()};
	}

}
