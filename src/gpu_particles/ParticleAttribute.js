import Graphics from '../Graphics';

export default class ParticleAttribute
{
	constructor(attr_name)
	{
		this.read = undefined;
		this.write = undefined;

		this.name = attr_name;

		this.update_material = undefined;

		this.update_scene = new THREE.Scene();
	}

	init_from_geometry(geometry)
	{
		//overrided by inheritance
	}

	init_from_attribute(particle_attribute)
	{

	}



	build_RT(particle_count)
	{
		let resolution = this.calculate_resolution(particle_count);
		let options = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.LinearEncoding,
				type: ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) ? THREE.HalfFloatType : THREE.FloatType,
				stencilBuffer: false,
				depthBuffer : false
    };

		return new THREE.WebGLRenderTarget(resolution,resolution, options);
	}

	calculate_resolution(particle_count)
	{
		return Math.ceil(Math.sqrt(particle_count));
	}

	swap_RT()
	{
		let tmp = this.read;
		this.read = this.write;
		this.write = tmp;
	}


	update()
	{
		if(this.update_material)
		{
			Graphics.blit(this.read, this.write, this.update_material);
			this.swap_RT();
		}
	}




	render_geometry_to_RT(geometry, material, RT)
	{
		let points = new THREE.Points( geometry, material );
		points.frustumCulled = false;
		let scene = new THREE.Scene();
		// scene.add( points );
		this.update_scene.add(points);
		Graphics.render(this.update_scene, undefined, RT);
		// Graphics.render(scene, undefined, RT);
	}
}
