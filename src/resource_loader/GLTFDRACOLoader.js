import AbstractLoader from '/resource_loader/AbstractLoader';

export default class GLTFDRACOLoader extends AbstractLoader
{
	constructor(resource_id, url, size)
	{
		super(resource_id, url, size);
		this.loader = new THREE.GLTFLoader();
		this.draco_loader = new THREE.DRACOLoader();

		this.draco_loader.setDecoderPath( 'libs/three/gltf/' );
		this.draco_loader.setDecoderConfig({type: 'js'});
		this.loader.setDRACOLoader( this.draco_loader );
	}

	load(resource_container)
	{
		let ctx = this;

		this.loader.load(	this.url, (gltf)=> {
			resource_container.set_resource(ctx.resource_id, gltf);
				ctx.__update_progress(1);
				ctx.__loading_ended()
			},
			(xhr) =>{
				if (xhr) {
					let total = xhr.total || this.size;
					ctx.__update_progress(THREE.Math.clamp(xhr.loaded / total), 0,1);
				}
			},
			(msg) => {
				ctx.__set_error(msg +"\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");
				ctx.__loading_ended()
			}
		);
	}

}
