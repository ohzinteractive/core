export class ResourceLoaderChecker {
    constructor(batch: any);
    batch: any;
    on_resources_loaded: any;
    timeout: number;
    setup(on_resources_loaded: any, timeout?: number): void;
    check(): void;
}
