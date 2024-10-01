export class ResourceContainer {
    constructor(name: any);
    name: any;
    resources: {};
    resources_by_url: {};
    set_resource(name: any, url: any, resource: any): void;
    get_resource(name: any): any;
    get(name: any): any;
}
