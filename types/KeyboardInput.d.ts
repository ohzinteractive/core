export class KeyboardInput {
    init(container: any): void;
    ctrlz_pressed: boolean;
    ctrlz_fired: boolean;
    keys: {};
    keys_keys: any[] | string[];
    container: any;
    on_key_down(e: any): void;
    on_key_up(e: any): void;
    clear(): void;
    release_key(key_name: any): void;
    release_keys(): void;
    press_key(key_name: any): void;
    is_key_pressed(key_name: any): any;
    is_key_down(key_name: any): any;
    is_key_released(key_name: any): any;
    register_key(key: any): void;
    unregister_key(key_name: any): void;
    dispose(): void;
}
