export declare const PROTOCOL_VERSION = 1;
export interface CanvasInfo {
    width: number;
    height: number;
    dpr: number;
}
export interface AppInfo {
    core_version: string;
    components_version: string;
    pit_version: string;
    active_view: string | null;
    has_camera: boolean;
    canvas: CanvasInfo;
}
export interface Command {
    id: string;
    cmd: string;
    args?: Record<string, unknown>;
}
export type Reply = {
    id: string;
    ok: true;
    result: unknown;
} | {
    id: string;
    ok: false;
    error: {
        code: string;
        message: string;
    };
};
