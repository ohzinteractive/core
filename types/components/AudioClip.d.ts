export default class AudioClip {
    constructor(buffer: any, loop?: boolean, volume?: number);
    buffer: any;
    loop: boolean;
    volume: number;
    audio: any;
    init(audio_listener: any): void;
    play(): void;
    pause(): void;
    stop(): void;
    get is_playing(): any;
}
