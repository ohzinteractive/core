export { resource_container as ResourceContainer };
declare const resource_container: ResourceContainer;
declare class ResourceContainer {
    init(): void;
    resources: {};
    resources_by_url: {};
    set_resource(name: any, url: any, resource: any): void;
    get_resource(name: any): any;
    get(name: any): any;
}
