export type DispatchEvent = (type: string, init: Record<string, unknown>) => void;
export type Sleep = (ms: number) => Promise<void>;
export type ToClient = (x: number, y: number, space: string) => {
    x: number;
    y: number;
};
export interface PointerRequest {
    action?: unknown;
    x?: unknown;
    y?: unknown;
    button?: unknown;
    space?: unknown;
    hold_ms?: unknown;
}
export interface DragRequest {
    from?: unknown;
    to?: unknown;
    steps?: unknown;
    duration_ms?: unknown;
    button?: unknown;
    space?: unknown;
}
export interface ScrollRequest {
    delta?: unknown;
    x?: unknown;
    y?: unknown;
    space?: unknown;
}
export interface KeyRequest {
    code?: unknown;
    action?: unknown;
    hold_ms?: unknown;
}
export interface InputResult {
    dispatched: string[];
    at?: number[];
    from?: number[];
    to?: number[];
    code?: string;
    delta?: number;
}
declare class InputSynthesizer {
    private dispatch;
    private sleep;
    private to_client;
    constructor(dispatch: DispatchEvent, sleep: Sleep, to_client: ToClient);
    pointer(request: PointerRequest): Promise<InputResult>;
    drag(request: DragRequest): Promise<InputResult>;
    scroll(request: ScrollRequest): Promise<InputResult>;
    key(request: KeyRequest): Promise<InputResult>;
    private send;
    private point;
    private pair;
    private space;
    private button;
    private text;
    private number;
    private positive;
    private error;
}
export { InputSynthesizer };
