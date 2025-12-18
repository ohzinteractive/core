export class AudioClip {
    /**
     * @param {AudioBuffer} buffer
     * @param {boolean} [loop]
     * @param {number} [volume]
     * @param {boolean} [positional]
     */
    constructor(buffer: AudioBuffer, loop?: boolean, volume?: number, positional?: boolean);
    buffer: AudioBuffer;
    loop: boolean;
    volume: number;
    positional: boolean;
    audio: TPositionalAudio | TAudio<GainNode>;
    /**
     * @param {AudioListener} audio_listener
     */
    init(audio_listener: AudioListener): void;
    play(): void;
    pause(): void;
    stop(): void;
    get is_playing(): boolean;
}
import { PositionalAudio as TPositionalAudio } from "three/src/audio/PositionalAudio";
import { Audio as TAudio } from "three/src/audio/Audio";
import { AudioListener } from "three/src/audio/AudioListener";
