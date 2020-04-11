import AbstractLoader from '/resource_loader/AbstractLoader';

export default class TextureLoader extends AbstractLoader
{
	constructor(resource_id, url)
	{
		super(resource_id, url);
		this.loader = new THREE.TextureLoader();
	}

	load(resource_container)
	{
		let ctx = this;

		this.loader.load(	this.url, (image)=> {
			resource_container.set_resource(ctx.resource_id, image);
				ctx.__update_progress(1);
				ctx.__loading_ended()
			},
			undefined,
			() => {
				ctx.__set_error("Image could not  be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯');
				ctx.__loading_ended()
			}
		);
	}

}
