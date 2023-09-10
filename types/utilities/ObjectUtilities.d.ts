export class ObjectUtilities {
    static is_object(item: any): boolean;
    static merge_deep(target: any, ...sources: any[]): any;
    static xml_to_json(xml: any): {
        '@attributes': {};
    };
}
