import AbstractLoader from '/resource_loader/AbstractLoader';

export default class TextLoader extends AbstractLoader
{
	constructor(resource_id, url)
	{
		super(resource_id, url);
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
				ctx.__update_progress(xhr.loaded/xhr.total);
			},
			(msg) => {
				ctx.__set_error(msg);
				ctx.__loading_ended()
			}
		);
	}

}
