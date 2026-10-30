export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error';
export interface ConsoleEntry {
    seq: number;
    level: ConsoleLevel;
    message: string;
    at: number;
}
export interface ConsoleLike {
    log: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}
export interface ErrorSource {
    addEventListener(type: string, listener: (event: unknown) => void): void;
    removeEventListener(type: string, listener: (event: unknown) => void): void;
}
export interface ConsoleReadOptions {
    level?: unknown;
    limit?: unknown;
    since?: unknown;
}
export interface ConsoleReadResult {
    entries: ConsoleEntry[];
    dropped: number;
    total: number;
    capacity: number;
}
declare class ConsoleBuffer {
    private capacity;
    private entries;
    private seq;
    private dropped;
    private clock;
    private target;
    private source;
    private originals;
    private on_error;
    private on_rejection;
    constructor(capacity?: number, clock?: () => number);
    install(target: ConsoleLike, source?: ErrorSource): void;
    dispose(): void;
    read(options: ConsoleReadOptions): ConsoleReadResult;
    private push;
    private format;
    private describe;
    private event_message;
    private event_reason;
}
export { ConsoleBuffer };
