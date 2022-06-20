import AbstractLoader from './AbstractLoader';

import AudioClip from '../components/AudioClip';

import { AudioContext } from 'three';

export default class AudioLoader extends AbstractLoader
{
  constructor(resource_id, url, loop = true, volume = 0, size, positional = false)
  {
    super(resource_id, url, size);
    this.loop = loop;
    this.volume = volume;
    this.positional = positional;
  }

  on_preloaded_finished(resource_container, response)
  {
    if (!window.user_interaction_for_audio)
    {
      setTimeout(this.on_preloaded_finished.bind(this, resource_container, response), 100);
    }
    else
    {
      if (resource_container.resources_by_url[this.url] === undefined)
      {
        this.instantiate_audio(resource_container, response);
      }
      else
      {
        resource_container.set_resource(this.resource_id, this.url, resource_container.resources_by_url[this.url]);

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      }
    }
  }

  instantiate_audio(resource_container, response)
  {
    response.arrayBuffer().then((array_buffer) =>
    {
      const context = AudioContext.getContext();
      context.decodeAudioData(array_buffer, (audio_buffer) =>
      {
        resource_container.set_resource(
          this.resource_id,
          this.url,
          new AudioClip(audio_buffer, this.loop, this.volume, this.positional)
        );

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      });
    });
  }
}
