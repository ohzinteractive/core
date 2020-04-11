import BlitMaterial from '../materials/BlitMaterial';
import frag from '../shaders/ssao/ssao_compose_frag';

export default class SSAOComposeMaterial extends BlitMaterial
{
	constructor()
	{
		super(frag);
		this.uniforms._AO = {value: undefined};
	}

}
