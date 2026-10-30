import type { CommandHandler, HandlerTiming } from './CommandDispatcher';
import { CommandDispatcher } from './CommandDispatcher';
import type { AppInfo } from './protocol';
interface DevBridgeOptions {
    port: number;
    app_info: () => AppInfo;
}
declare class DevBridge {
    dispatcher: CommandDispatcher;
    private socket;
    private options;
    private retry_timer;
    private disposed;
    constructor();
    init(options: DevBridgeOptions): void;
    register(cmd: string, timing: HandlerTiming, handler: CommandHandler): void;
    on_frame_end(): void;
    dispose(): void;
    private connect;
    private on_message;
    private parse_frame;
    private as_text;
    private send_reply;
    private schedule_retry;
}
export { DevBridge };
