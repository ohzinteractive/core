import AbstractLoader from '/resource_loader/AbstractLoader';

export default class HDRCubeTextureLoader extends AbstractLoader
{
	constructor(resource_id, url)
	{
		super(resource_id, url);
		this.loader = new THREE.HDRCubeTextureLoader();

		this.url_suffix = [ 'posx.hdr', 'negx.hdr', 'posy.hdr', 'negy.hdr', 'posz.hdr', 'negz.hdr' ];


	}

	load(resource_container)
	{
		let ctx = this;

		this.loader.setPath( this.url)
						   .setDataType( THREE.UnsignedByteType )
					     .load(	this.url_suffix, (hdr)=> {
				resource_container.set_resource(ctx.resource_id, hdr);
				ctx.__update_progress(1);
				ctx.__loading_ended()
			},
			(xhr) =>{
				ctx.__update_progress(xhr.loaded/xhr.total);
			},
			(msg) => {
				ctx.__set_error(msg +"\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");
				ctx.__loading_ended()
			}
		);
	}

}
