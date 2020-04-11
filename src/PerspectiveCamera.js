export default class PerspectiveCamera extends THREE.PerspectiveCamera
{
	constructor(fov, aspect, near, far)
	{
		super(fov, aspect, near, far);

		this.clear_color = new THREE.Color("#000000");
		this.clear_alpha = 1;
	}
}