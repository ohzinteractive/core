export class AudioClip {
    constructor(buffer: any, loop?: boolean, volume?: number, positional?: boolean);
    buffer: any;
    loop: boolean;
    volume: number;
    positional: boolean;
    audio: any;
    init(audio_listener: any): void;
    play(): void;
    pause(): void;
    stop(): void;
    get is_playing(): any;
}
