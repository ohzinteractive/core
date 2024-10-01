export { capabilities as Capabilities };
declare const capabilities: Capabilities;
declare class Capabilities {
    init(): void;
    max_anisotropy: number;
    vertex_texture_sampler_available: boolean;
    fp_textures_available: boolean;
}
