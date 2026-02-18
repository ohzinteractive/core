declare class ResourceContainer {
    resources: Record<string, any>;
    resources_by_url: Record<string, any>;
    
    init(): void;
    set_resource(name: string, url: string, resource: any): void;
    get_resource(name: string): any;
    get(name: string): any;
}

declare const resource_container: ResourceContainer;
export { resource_container as ResourceContainer };

