import basic_color_frag from '/shaders/basic_color/basic_color_frag';
import basic_color_vert from '/shaders/basic_color/basic_color_vert';
import SceneManager from '/SceneManager';
import CameraManager from '/CameraManager';
import ReflectionPlaneContext from '/ReflectionPlaneContext';
import Screen from '/Screen';
import BaseRender from '/BaseRender';


export default class PlanarReflectionsRender extends BaseRender
{
	constructor()
	{
		super();
		let color = 0.946;
		this.plane_material_solid = new THREE.ShaderMaterial({
      uniforms: {
        _Color: {value : new THREE.Vector4(color,color,color,0.5)}
      },
      vertexShader: basic_color_vert,
      fragmentShader: basic_color_frag,
      transparent: true,
      depthWrite: false
    });

    this.stencil_mask_scene = new THREE.Scene();




		this.original_view_matrix = new THREE.Matrix4();
		this.inverted_view_matrix = new THREE.Matrix4();
		this.reflection_matrix    = new THREE.Matrix4().set(  1, 0, 0, 0,
																													0,-1, 0, 0,
																													0, 0, 1, 0,
																													0, 0, 0, 1);



		this.gl = undefined;

	}

	on_enter(context, renderer)
	{
		this.gl = renderer.domElement.getContext('webgl');
  	CameraManager.current.parent = SceneManager.current;

		var plane_material_mask = new THREE.MeshBasicMaterial( {color: CameraManager.current.clear_color, depthWrite: false} );
		this.plane_mask = new THREE.Mesh( ReflectionPlaneContext.target_geometry, plane_material_mask );
		this.plane_solid = new THREE.Mesh( ReflectionPlaneContext.target_geometry, this.plane_material_solid );

		let clear_color = CameraManager.current.clear_color;
		this.plane_material_solid.uniforms._Color.value.set(clear_color.r, clear_color.g, clear_color.b, 0.5);

		this.stencil_mask_scene.add(this.plane_mask);
		SceneManager.current.add(this.plane_solid);
		this.plane_solid.visible = false;

		CameraManager.current.matrixAutoUpdate = false;
		renderer.autoClear = false;



	}

	render(context, renderer)
	{
		if(CameraManager.current)
		{
    	CameraManager.current.aspect = Screen.aspect_ratio;
	    CameraManager.current.updateProjectionMatrix();
	    CameraManager.current.updateMatrix();
			CameraManager.current.updateMatrixWorld(true);

			renderer.setClearColor(CameraManager.current.clear_color, CameraManager.current.clear_alpha);

			this.__render_stencil_mask(renderer, this.gl);

			this.plane_solid.visible = true;
			this.__render_reflected_scene(renderer, this.gl);
			this.plane_solid.visible = true;

			// render scene

			renderer.clear(false,true,false);
			this.plane_solid.visible = true;
			renderer.render(SceneManager.current, CameraManager.current);
		}

	}

	__render_stencil_mask(renderer, gl)
	{
		//RENDER MASK
		gl.enable(gl.STENCIL_TEST);
		gl.stencilFunc(gl.ALWAYS, 1, 1);
		gl.stencilOp(gl.KEEP, gl.REPLACE, gl.REPLACE);
		renderer.clear(true,true,true);
		renderer.render(this.stencil_mask_scene, CameraManager.current);
	}

	__render_reflected_scene(renderer, gl)
	{
		// // RENDER REFLECTION
		gl.stencilFunc(gl.EQUAL, 1, 1);
		gl.stencilOp(gl.KEEP, gl.REPLACE, gl.REPLACE);
		this.reflection_matrix.set( 1, 0, 0, 0,
																0,-1, 0, ReflectionPlaneContext.target_position.y*2,
																0, 0, 1, 0,
																0, 0, 0, 1);
		this.original_view_matrix.copy(CameraManager.current.matrixWorldInverse);
		this.inverted_view_matrix.copy(CameraManager.current.matrixWorldInverse).multiply(this.reflection_matrix);
		CameraManager.current.matrixWorldInverse.copy(this.inverted_view_matrix.clone());

		renderer.render(SceneManager.current, CameraManager.current);


		gl.disable(gl.STENCIL_TEST);

		CameraManager.current.matrixWorldInverse.copy(this.original_view_matrix);
	}


}
