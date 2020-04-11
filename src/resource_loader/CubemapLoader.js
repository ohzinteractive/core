import AbstractLoader from '/resource_loader/AbstractLoader';

export default class CubemapLoader extends AbstractLoader
{
	constructor(resource_id, url)
	{
		super(resource_id, url);
		this.loader = new THREE.CubeTextureLoader();

		this.urls = [];
		this.urls.push(url);
		this.urls.push(url);
		this.urls.push(url);
		this.urls.push(url);
		this.urls.push(url);
		this.urls.push(url);
	}

	load(resource_container)
	{
		let ctx = this;

		this.loader.load(	this.urls, (image)=> {
			resource_container.set_resource(ctx.resource_id, image);
				ctx.__update_progress(1);
				ctx.__loading_ended()
			},
			undefined,
			(error) => {
				ctx.__set_error("Image could not  be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯', error);
				ctx.__loading_ended()
			}
		);
	}

}
