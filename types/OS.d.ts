export { os as OS };
declare const os: OS;
declare class OS {
    init(): void;
    operating_systems: {
        ANDROID: string;
        IOS: string;
        LINUX: string;
        MAC: string;
        WINDOWS: string;
    };
    is_mobile: boolean;
    is_ipad: boolean;
    is_ios: boolean;
    is_android: boolean;
    is_linux: boolean;
    is_mac: boolean;
    is_windows: boolean;
    get_os(): string;
}
