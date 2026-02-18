declare class ResourceLoaderChecker {
    batch: any;
    on_resources_loaded: (() => void) | undefined;
    timeout: number;
    constructor(batch: any);
    setup(on_resources_loaded: () => void, timeout?: number): void;
    check(): void;
}
export { ResourceLoaderChecker };
