import type { AudioListener} from 'three';
import { Audio as TAudio, PositionalAudio as TPositionalAudio } from 'three';

class AudioClip
{
  audio: TPositionalAudio | TAudio<GainNode | PannerNode> | undefined;
  buffer: AudioBuffer;
  loop: boolean;
  positional: boolean;
  volume: number;

  constructor(buffer: AudioBuffer, loop = true, volume = 1, positional = false)
  {
    this.buffer = buffer;
    this.loop = loop;
    this.volume = volume;
    this.positional = positional;

    this.audio = undefined;
  }

  init(audio_listener: AudioListener): void
  {
    if (this.positional)
    {
      this.audio = new TPositionalAudio(audio_listener);
    }
    else
    {
      this.audio = new TAudio(audio_listener);
    }

    this.audio.setBuffer(this.buffer);
    this.audio.setLoop(this.loop);

    // This prevents undesired volume at the beginning of playing
    this.audio.gain.gain.value = 0;

    this.audio.setVolume(this.loop ? 0 : this.volume);
  }

  play(): void
  {
    this.audio!.play();
  }

  pause(): void
  {
    this.audio!.pause();
  }

  stop(): void
  {
    this.audio!.stop();
  }

  get is_playing(): boolean
  {
    return this.audio!.isPlaying;
  }
}

export { AudioClip };
