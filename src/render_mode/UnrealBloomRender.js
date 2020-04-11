import CameraManager from '/CameraManager';
import SceneManager from '/SceneManager';
import Screen from '/Screen';
import BaseRender from './BaseRender';
import Configuration from '/Configuration';
import SSAOMaterial from '/materials/SSAOMaterial';
import UnrealComposeMaterial from '/materials/UnrealComposeMaterial';
import Blurrer from '/render_utilities/Blurrer';
import Graphics from '/Graphics';


export default class UnrealBloomRender extends BaseRender
{
	constructor()
	{
		super();

			this.strength = 1;
			this.radius = 0.1;
			this.threshold = 0;
			this.resolution = new THREE.Vector2( Screen.width, Screen.height );

			// create color only once here, reuse it later inside the render function
			this.clearColor = new THREE.Color( 0, 0, 0 );

			// render targets
			let pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
			this.renderTargetsHorizontal = [];
			this.renderTargetsVertical = [];
			this.nMips = 5;
			let resx = Math.round( this.resolution.x / 2 );
			let resy = Math.round( this.resolution.y / 2 );

			for ( let i = 0; i < this.nMips; i ++ ) {

				let renderTargetHorizonal = new THREE.WebGLRenderTarget( resx, resy, pars );

				renderTargetHorizonal.texture.name = "UnrealBloomPass.h" + i;
				renderTargetHorizonal.texture.generateMipmaps = false;

				this.renderTargetsHorizontal.push( renderTargetHorizonal );

				let renderTargetVertical = new THREE.WebGLRenderTarget( resx, resy, pars );

				renderTargetVertical.texture.name = "UnrealBloomPass.v" + i;
				renderTargetVertical.texture.generateMipmaps = false;

				this.renderTargetsVertical.push( renderTargetVertical );

				resx = Math.round( resx / 2 );

				resy = Math.round( resy / 2 );

			}

			this.separableBlurMaterials = [];
			let kernelSizeArray = [ 3, 5, 7, 9, 11 ];
			resx = Math.round( this.resolution.x / 2 );
			resy = Math.round( this.resolution.y / 2 );

			for ( let i = 0; i < this.nMips; i ++ ) {

				this.separableBlurMaterials.push( this.getSeperableBlurMaterial( kernelSizeArray[ i ] ) );

				this.separableBlurMaterials[ i ].uniforms[ "texSize" ].value = new THREE.Vector2( resx, resy );

				resx = Math.round( resx / 2 );

				resy = Math.round( resy / 2 );

			}


			this.compositeMaterial = new UnrealComposeMaterial( this.nMips );
			this.compositeMaterial.uniforms[ "blurTexture1" ].value = this.renderTargetsVertical[ 0 ].texture;
			this.compositeMaterial.uniforms[ "blurTexture2" ].value = this.renderTargetsVertical[ 1 ].texture;
			this.compositeMaterial.uniforms[ "blurTexture3" ].value = this.renderTargetsVertical[ 2 ].texture;
			this.compositeMaterial.uniforms[ "blurTexture4" ].value = this.renderTargetsVertical[ 3 ].texture;
			this.compositeMaterial.uniforms[ "blurTexture5" ].value = this.renderTargetsVertical[ 4 ].texture;
			this.compositeMaterial.uniforms[ "bloomStrength" ].value = strength;
			this.compositeMaterial.uniforms[ "bloomRadius" ].value = 0.05;
			this.compositeMaterial.needsUpdate = true;


			let bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
			this.compositeMaterial.uniforms[ "bloomFactors" ].value = bloomFactors;
			this.bloomTintColors = [ new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ),
									 new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ) ];
			this.compositeMaterial.uniforms[ "bloomTintColors" ].value = this.bloomTintColors;



		// this.bloom_compose_mat = new BloomComposeMaterial();
		// window.bloom_mat = this.bloom_compose_mat;

		// this.main_RT = new THREE.WebGLRenderTarget(Screen.width, Screen.height);
		// this.blur_RT = new THREE.WebGLRenderTarget(Screen.width/2, Screen.height/2);
		// this.blurrer = new Blurrer();

	}


	render()
	{

			// this.__check_RT_size();

			// Graphics.clear(this.main_RT, CameraManager.current, true, false);
			// Graphics.render(SceneManager.current, CameraManager.current, this.main_RT);


			// Graphics.blit(this.main_RT, this.blur_RT);

			// // // BLUR
			// this.blurrer.blur(this.blur_RT);

			// this.bloom_compose_mat.uniforms._BlurredTex.value = this.blur_RT.texture;

			// // // // COMPOSE
			// Graphics.blit(this.main_RT, undefined, this.bloom_compose_mat);


	}



	__check_RT_size()
	{
		if(this.main_RT.width !== Screen.width || this.main_RT.height !== Screen.height)
		{
			this.main_RT.setSize(Screen.width, Screen.height);
			this.blur_RT.setSize(Screen.width, Screen.height);
		}
	}

}
