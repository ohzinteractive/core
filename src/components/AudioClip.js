import { Audio as THREEAudio } from 'three';

export default class AudioClip
{
  constructor(buffer, loop = true, volume = 1)
  {
    this.buffer = buffer;
    this.loop = loop;
    this.volume = volume;

    this.audio = undefined;
  }

  init(audio_listener)
  {
    this.audio = new THREEAudio(audio_listener);
    this.audio.setBuffer(this.buffer);
    this.audio.setLoop(this.loop);
    this.audio.setVolume(this.volume);
  }

  play()
  {
    this.audio.play();
  }

  pause()
  {
    this.audio.pause();
  }

  stop()
  {
    this.audio.stop();
  }

  get is_playing()
  {
    return this.audio.isPlaying;
  }
}
