declare class DrawIOAnimationSheet {
    constructor();
    parse(xml_document: string): {
        animation_tracks: {
            attribute_name: string;
            from_time: number;
            to_time: number;
            to_value: number;
            easing_function: string;
        }[];
        triggers: {
            name: string;
            method: string;
            at_time: number;
        }[];
    };
    get_node_x_position(node: Element): number;
}
export { DrawIOAnimationSheet };
