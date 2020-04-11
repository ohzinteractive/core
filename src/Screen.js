class Screen {
	constructor()
	{
		this.width = 1;
		this.height = 1;
		this.width_height = new THREE.Vector2(this.width, this.height);

		this.screen_materials = [];

		this.native_width = this.width;
		this.native_height = this.height;

		this.pixel_size = new THREE.Vector2(1/this.width, 1/this.height);
	}

	update_size(width, height)
	{
		this.width = width;
		this.height = height;

		this.pixel_size = new THREE.Vector2(1/this.width, 1/this.height) ;

		this.width_height.x = width  ;
		this.width_height.y = height ;

		let i = this.screen_materials.length;
		while(i--)
		{
			this.screen_materials[i].uniforms._ScreenSize.value = this.width_height;
		}
	}

	apply_pixel_density_v2(vector2)
	{
		vector2.multiplyScalar(1/window.devicePixelRatio);

		return vector2;
	}
	apply_pixel_density(value)
	{
		return value * (1/window.devicePixelRatio);
	}
	update_native_size()
	{
		this.native_width = window.innerWidth;
		this.native_height = window.innerHeight;
	}

	add_screen_material(mat)
	{
		this.screen_materials.push(mat);
		mat.uniforms._ScreenSize.value = this.width_height;
	}
	remove_screen_material(mat)
	{
    let index = this.screen_materials.indexOf(mat);
    if (index > -1) {
      this.screen_materials.splice(index, 1);
    }
	}

	get_pixel_size()
	{
		return this.pixel_size;
	}

	get aspect_ratio()
	{
		return this.width/this.height;
	}


}

const SCREEN = new Screen();
module.exports = SCREEN;
