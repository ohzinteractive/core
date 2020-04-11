import AbstractLoader from '/resource_loader/AbstractLoader';

export default class AudioLoader extends AbstractLoader
{
	constructor(resource_id, url, listener, loop, volume)
	{
		super(resource_id, url);
		this.loader = new THREE.AudioLoader();
		this.loop = loop;
		this.listener = listener;
		this.voluem = volume;
	}

	load(resource_container)
	{
		let ctx = this;
		let sound = new THREE.Audio(this.listener);

		this.loader.load(this.url, (audio)=> {
			sound.setBuffer(audio);
			sound.setLoop(this.loop);
			sound.setVolume(this.voluem);

			resource_container.set_resource(ctx.resource_id, sound);

			if (!resource_container.get_resource('audio_listener')) {
				resource_container.set_resource('audio_listener', this.listener);
			}

			ctx.__update_progress(1);
			ctx.__loading_ended()
		},
		undefined,
		(error) => {
			ctx.__set_error("Audio could not be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯', error);
			ctx.__loading_ended()
		});
	}

}
