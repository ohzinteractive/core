import type { AudioListener } from 'three';
import { Audio as TAudio, PositionalAudio as TPositionalAudio } from 'three';
declare class AudioClip {
    audio: TPositionalAudio | TAudio<GainNode | PannerNode> | undefined;
    buffer: AudioBuffer;
    loop: boolean;
    positional: boolean;
    volume: number;
    constructor(buffer: AudioBuffer, loop?: boolean, volume?: number, positional?: boolean);
    init(audio_listener: AudioListener): void;
    play(): void;
    pause(): void;
    stop(): void;
    get is_playing(): boolean;
}
export { AudioClip };
