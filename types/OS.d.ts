 export class OS {
    static init(): void;
    static operating_systems: {
        ANDROID: string;
        IOS: string;
        LINUX: string;
        MAC: string;
        WINDOWS: string;
    };
    static get_os(): string;
    static get is_android(): boolean;
    static get is_ios(): boolean | RegExpMatchArray;
    static get is_ipad(): boolean;
    static get is_mobile(): boolean;
    static get is_linux(): boolean;
    static get is_mac(): boolean;
    static get is_windows(): boolean;
}
