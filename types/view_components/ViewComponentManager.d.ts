 export class ViewComponentManager {
    static components: any[];
    static enabled_components: Set<any>;
    static update(): void;
    static register_component(component: any): void;
    static enable_component(component: any): void;
    static disable_component(component: any): void;
    static get_component_by_name(component_name: any): void;
    static get(component_name: any): any;
}
