 export class ResourceContainer {
    static init(): void;
    static resources: {};
    static resources_by_url: {};
    static set_resource(name: any, url: any, resource: any): void;
    static get_resource(name: any): any;
    static get(name: any): any;
}
