import vert from './editor/shaders/object_picker_vert';
import frag from './editor/shaders/object_picker_frag';
export default class Mesh extends THREE.Mesh
{
	constructor(geometry, material)
	{
		super(geometry, material);

		this._selectable_material = this.__get_selectable_material();
		this.original_material = this.material;
		this.stored_layers = this.layers.mask;
	}

	__get_selectable_material()
	{
		return new THREE.ShaderMaterial({
			uniforms: {
				_Color: {value: new THREE.Color()}
			},
			vertexShader: vert,
      fragmentShader: frag
		});
	}

	restore_material()
	{
		this.material = this.original_material;
	}

	store_layer_state()
	{
		this.stored_layers = this.layers.mask;
	}
	restore_layer_state()
	{
		this.layers.mask = this.stored_layers;
	}

	get selectable_material()
	{
		return this._selectable_material;
	}
}
