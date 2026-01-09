import { AudioContext } from 'three';

import { AudioClip } from '../components/AudioClip';
import { AbstractLoader } from './AbstractLoader';

class AudioLoader extends AbstractLoader
{
  loop: boolean;
  volume: number;
  positional: boolean;

  constructor(resource_id: any, url: any, loop = true, volume = 0, size: any, positional = false)
  {
    super(resource_id, url, size);
    this.loop = loop;
    this.volume = volume;
    this.positional = positional;
  }

  on_preloaded_finished(resource_container: any)
  {
    // if (!window.user_interaction_for_audio)
    // {
    //   setTimeout(this.on_preloaded_finished.bind(this, resource_container), 100);
    // }
    // else
    // {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      this.instantiate_audio(resource_container);
    }
    else
    {
      resource_container.set_resource(this.resource_id, this.url, resource_container.resources_by_url[this.url]);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    }
    // }
  }

  instantiate_audio(resource_container: any)
  {
    const context = AudioContext.getContext();

    const buffer = context.createBuffer(2, 22050, 44100);

    fetch(this.url).then(r => r.blob()).then((response) =>
    {
      if (response.arrayBuffer)
      {
        response.arrayBuffer().then((array_buffer) =>
        {
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
      else
      {
        resource_container.set_resource(
          this.resource_id,
          this.url,
          new AudioClip(buffer, this.loop, this.volume, this.positional)
        );

        this.__update_downloaded_bytes(1, 1);
        this.__loading_ended();
      }
    });
  }
}

export { AudioLoader };
