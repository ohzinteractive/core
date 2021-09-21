declare var _default: OS;
export default _default;
declare class OS {
    init(): void;
    operating_systems: {
        ANDROID: string;
        IOS: string;
        LINUX: string;
        MAC: string;
        WINDOWS: string;
    };
    get_os(): string;
    get is_android(): boolean;
    get is_ios(): boolean | RegExpMatchArray;
    get is_safari(): boolean;
    get is_ipad(): boolean;
    get is_mobile(): boolean;
    get is_linux(): boolean;
    get is_mac(): boolean;
    get is_windows(): boolean;
}
