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
        this.audio = new THREE.Audio(audio_listener);
        this.audio.setBuffer(this.buffer);
        this.audio.setLoop(this.loop);
        this.audio.setVolume(this.volume);
    }

    play()
    {
        this.audio.play();
    }

}
