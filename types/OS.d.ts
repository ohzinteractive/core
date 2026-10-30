declare class OS {
    is_android: boolean;
    is_ios: boolean;
    is_ipad: boolean;
    is_linux: boolean;
    is_mac: boolean;
    is_mobile: boolean;
    is_windows: boolean;
    operating_systems: {
        ANDROID: string;
        IOS: string;
        LINUX: string;
        MAC: string;
        WINDOWS: string;
    };
    init(): void;
    get_os(): string;
}
declare const os: OS;
export { os as OS };
