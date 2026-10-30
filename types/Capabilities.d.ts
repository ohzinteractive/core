declare class Capabilities {
    max_anisotropy: number;
    vertex_texture_sampler_available: boolean;
    init(): void;
}
declare const capabilities: Capabilities;
export { capabilities as Capabilities };
