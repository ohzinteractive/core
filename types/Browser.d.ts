 export class Browser {
    static init(): void;
    static browser_name: string;
    static get name(): string;
    static get is_safari(): boolean;
    static get is_chrome(): boolean;
    static get is_ie(): boolean;
    static get is_firefox(): boolean;
    static get has_webm(): boolean;
    static get has_hvec(): boolean;
    static get preferred_video_extension(): string;
}
