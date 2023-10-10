export { browser as Browser };
declare const browser: Browser;
declare class Browser {
    init(opr: any, chrome: any): void;
    browser_name: string;
    agent: string;
    vr_browser_keywords: string[];
    vr_browser_name: string;
    has_web_xr_support: boolean;
    version: number;
    get name(): string;
    get is_safari(): boolean;
    get is_chrome(): boolean;
    get is_edge(): boolean;
    get is_edge_chromium(): boolean;
    get is_vr(): boolean;
    get has_webm(): boolean;
    get has_hvec(): boolean;
    get preferred_video_extension(): "webm" | "hvec.mp4" | "mp4";
    get_version(): number;
}
