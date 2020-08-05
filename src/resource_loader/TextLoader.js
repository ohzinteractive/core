import AbstractLoader from '/resource_loader/AbstractLoader';

export default class TextLoader extends AbstractLoader
{
	constructor(resource_id, url, size)
	{
		super(resource_id, url, size);
		this.loader = new THREE.FileLoader();
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
					ctx.__update_progress(xhr.loaded / total);
				}
			},
			(msg) => {
				ctx.__set_error(msg);
				ctx.__loading_ended()
			}
		);
	}

}
