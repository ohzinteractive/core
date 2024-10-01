export class KeyboardInput {
    /**
     * @param {HTMLElement} container
     */
    init(container: HTMLElement): void;
    ctrlz_pressed: boolean;
    ctrlz_fired: boolean;
    /**
     * @type {{[key:string]:{key_name: string, pressed: boolean, down: boolean, fired: boolean, released: boolean}}}
     */
    keys: {
        [key: string]: {
            key_name: string;
            pressed: boolean;
            down: boolean;
            fired: boolean;
            released: boolean;
        };
    };
    /** @type {string[]} */
    keys_keys: string[];
    container: HTMLElement;
    /**
     * @param {KeyboardEvent} e
     */
    on_key_down(e: KeyboardEvent): void;
    /**
     * @param {KeyboardEvent} e
     */
    on_key_up(e: KeyboardEvent): void;
    clear(): void;
    /**
     * @param {string} key_name
     */
    release_key(key_name: string): void;
    release_keys(): void;
    /**
     * @param {string} key_name
     */
    press_key(key_name: string): void;
    /**
     * @param {string} key_name
     * @returns {boolean}
     */
    is_key_pressed(key_name: string): boolean;
    /**
     * @param {string} key_name
     * @returns {boolean}
     */
    is_key_down(key_name: string): boolean;
    /**
     * @param {string} key_name
     * @returns {boolean}
     */
    is_key_released(key_name: string): boolean;
    /**
     * @param {string} key
     */
    register_key(key: string): void;
    /**
     * @param {string} key_name
     */
    unregister_key(key_name: string): void;
    dispose(): void;
}
