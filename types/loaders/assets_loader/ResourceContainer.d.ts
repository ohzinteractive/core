declare class ResourceContainer {
    name: string;
    resources: Record<string, any>;
    resources_by_url: Record<string, any>;
    constructor(name: string);
    set_resource(name: string, url: string, resource: any): void;
    get_resource(name: string): any;
    get(name: string): any;
}
export { ResourceContainer };
