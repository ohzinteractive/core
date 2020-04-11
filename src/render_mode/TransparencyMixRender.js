import Screen from '/Screen';
import RenderLayers from '/RenderLayers';

import transparent_mix_vert from '/shaders/transparent_mix/transparent_mix_vert';
import transparent_mix_frag from '/shaders/transparent_mix/transparent_mix_frag';
import copy_frag from '/shaders/transparent_mix/copy_frag';
import fxaa from '/shaders/anti_aliasing/fxaa';
import Configuration from '/Configuration';

export default class TransparencyMixRender
{
	constructor(webgl)
	{
		this.SSAA = Configuration.use_ssaa? 2 : 1;
		this.main_rt 				= new THREE.WebGLRenderTarget(Screen.width*this.SSAA, Screen.height*this.SSAA);
		this.opaque_rt 			= new THREE.WebGLRenderTarget(Screen.width*this.SSAA, Screen.height*this.SSAA);
		this.fxaa_rt 				= new THREE.WebGLRenderTarget(Screen.width*this.SSAA, Screen.height*this.SSAA);


		this.mix_material = new THREE.ShaderMaterial({
      uniforms: {
        _OpaqueTex: 			{value : this.opaque_rt.texture},
        _TransparentTex: 	{value : this.main_rt.texture},
        _Resolution: 	{value : new THREE.Vector2(Screen.width, Screen.height)},
        _Opacity: {value: Configuration.transparency_amount}
      },
      vertexShader: transparent_mix_vert,
      fragmentShader: transparent_mix_frag,
      depthTest: false,
      depthWrite: false
    });

    this.copy_material = new THREE.ShaderMaterial({
      uniforms: {
        _MainTex: 			{value : this.main_rt.texture}
      },
      vertexShader: transparent_mix_vert,
      fragmentShader: copy_frag,
      depthTest: false,
      depthWrite: false
    });

    this.fxaa_material = this.__get_fxaa_material();

    let geometry = new THREE.PlaneGeometry( 1,1 );
		this.render_plane = new THREE.Mesh( geometry, this.mix_material );
		this.render_plane.frustumCulled = false;

		this.copy_plane = new THREE.Mesh( geometry, this.copy_material );
		this.copy_plane.frustumCulled = false;


		this.mix_scene = new THREE.Scene();
		this.mix_scene.add(this.render_plane);
		this.copy_scene = new THREE.Scene();
		this.copy_scene.add(this.copy_plane);


	}

	resize()
	{
		this.main_rt.setSize(Screen.width*this.SSAA, Screen.height*this.SSAA);
		this.opaque_rt.setSize(Screen.width*this.SSAA, Screen.height*this.SSAA);
		this.fxaa_rt.setSize(Screen.width*this.SSAA, Screen.height*this.SSAA);
		this.fxaa_material.uniforms._Resolution.value.set(Screen.width*this.SSAA, Screen.height*this.SSAA);
		this.mix_material.uniforms._Resolution.value.set(Screen.width*this.SSAA, Screen.height*this.SSAA);
	}

	__get_fxaa_material()
	{
		return new THREE.ShaderMaterial({
      uniforms: {
        _MainTex: 			{value : this.fxaa_rt.texture},
        _Resolution: 		{value : new THREE.Vector2(Screen.width*this.SSAA, Screen.height*this.SSAA)}
      },
      vertexShader: transparent_mix_vert,
      fragmentShader: fxaa,
      depthTest: false,
      depthWrite: false
    });
	}


	render(webgl)
	{
		webgl.camera.updateMatrix();
		webgl.camera.updateMatrixWorld();


		this.__render_opaque(webgl);
		this.__render_transparent(webgl);


		webgl.camera.layers.disable(RenderLayers.transparent);
		webgl.camera.layers.enable(RenderLayers.opaque);


		if(Configuration.use_fxaa)
		{
			webgl._renderer.render(this.mix_scene, webgl.camera, this.fxaa_rt, false);
			this.mix_scene.overrideMaterial = this.fxaa_material;
			webgl._renderer.render(this.mix_scene, webgl.camera, undefined, false);
			this.mix_scene.overrideMaterial = undefined;
		}
		else
		{
			webgl._renderer.render(this.mix_scene, webgl.camera, undefined, false);
		}


	}
	__render_opaque(webgl)
	{
		webgl._renderer.setClearColor(webgl.clear_color);
		webgl._renderer.setClearAlpha(1);

		webgl.camera.layers.disable(RenderLayers.transparent);
		webgl.camera.layers.enable(RenderLayers.opaque);
		webgl._renderer.clearTarget(this.main_rt, true,true,false);
		webgl._renderer.render(webgl.scene, webgl.camera, this.main_rt, false);
		webgl._renderer.render(this.copy_scene, webgl.camera, this.opaque_rt, false);

	}

	__render_transparent(webgl)
	{
		webgl._renderer.setClearColor(0x000000);
		webgl._renderer.setClearAlpha(0);

		webgl.camera.layers.disable(RenderLayers.opaque);
		webgl.camera.layers.enable(RenderLayers.transparent);

		webgl._renderer.clearTarget(this.main_rt, true,false,false);
		webgl._renderer.render(webgl.scene, webgl.camera, this.main_rt, false);
	}

	on_enter(webgl)
	{
		webgl._renderer.autoClear = false;

	}

	on_exit(webgl)
	{
		webgl._renderer.autoClear = true;
	}
}
