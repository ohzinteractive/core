export class ObjectUtilities {
    /**
    * Simple object check.
    */
    static is_object(item: any): boolean;

    /**
     * Deep merge two objects.
     */
    static merge_deep(target: any, ...sources: any): void;

    /**
     * Convert XML to JSON
     */
    static xml_to_json(xml: any): object;
}
