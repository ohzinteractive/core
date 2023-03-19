export { browser as Browser };
declare const browser: Browser;
declare class Browser {
    init(): void;
    browser_name: string;
    agent: string;
    get name(): string;
    get is_safari(): boolean;
    get is_chrome(): boolean;
    get is_edge(): boolean;
    get is_edge_chromium(): boolean;
    get has_webm(): boolean;
    get has_hvec(): boolean;
    get preferred_video_extension(): "webm" | "hvec.mp4" | "mp4";
}
