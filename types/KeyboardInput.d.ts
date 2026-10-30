declare class KeyboardInput {
    container: Element | Document;
    ctrlz_fired: boolean;
    ctrlz_pressed: boolean;
    keys: {
        [key: string]: {
            key_name: string;
            pressed: boolean;
            down: boolean;
            fired: boolean;
            released: boolean;
        };
    };
    keys_keys: string[];
    init(container: Element | Document): void;
    on_key_down: (e: KeyboardEvent) => void;
    on_key_up: (e: KeyboardEvent) => void;
    clear(): void;
    release_key(key_name: string): void;
    release_keys(): void;
    press_key(key_name: string): void;
    is_key_pressed(key_name: string): boolean;
    is_key_down(key_name: string): boolean;
    is_key_released(key_name: string): boolean;
    register_key(key: string): void;
    unregister_key(key_name: string): void;
    dispose(): void;
}
export { KeyboardInput };
