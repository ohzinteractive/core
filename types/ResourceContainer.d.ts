declare var _default: ResourceContainer;
export default _default;
declare class ResourceContainer {
    init(): void;
    resources: {};
    resources_by_url: {};
    set_resource(name: any, url: any, resource: any): void;
    get_resource(name: any): any;
    get(name: any): any;
}
