export type RenderModeFactory = (options: Record<string, unknown>) => unknown;
export interface RenderModeDescriptor {
    name: string;
    description?: string;
    options?: string[];
    factory: RenderModeFactory;
}
export interface RenderModeSummary {
    name: string;
    description: string;
    options: string[];
}
declare class RenderModeRegistry {
    private descriptors;
    constructor(descriptors: RenderModeDescriptor[]);
    list(): RenderModeSummary[];
    create(name: unknown, options: Record<string, unknown>): unknown;
    private error;
}
export { RenderModeRegistry };
