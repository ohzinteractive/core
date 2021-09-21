export default class Pool {
    available: any[];
    busy: any[];
    preload(starting_pool_size: any): void;
    instantiate(): void;
    get(): any;
    release(obj: any): void;
    release_all(): void;
    __create(): void;
}
