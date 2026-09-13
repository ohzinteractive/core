import type { CommandHandler, HandlerTiming } from './CommandDispatcher';
import { CommandDispatcher } from './CommandDispatcher';
import type { AppInfo, Command, Reply } from './protocol';
import { PROTOCOL_VERSION } from './protocol';

const RETRY_DELAY_MS = 2000;

interface DevBridgeOptions
{
  port: number;
  app_info: () => AppInfo;
}

class DevBridge
{
  dispatcher: CommandDispatcher;

  private socket: WebSocket;
  private options: DevBridgeOptions;
  private retry_timer: number;
  private disposed: boolean;

  constructor()
  {
    this.socket = null;
    this.options = null;
    this.retry_timer = 0;
    this.disposed = false;
    this.dispatcher = new CommandDispatcher((reply) => this.send_reply(reply));
  }

  init(options: DevBridgeOptions)
  {
    this.options = options;
    this.disposed = false;
    this.connect();
  }

  register(cmd: string, timing: HandlerTiming, handler: CommandHandler)
  {
    this.dispatcher.register(cmd, timing, handler);
  }

  // Called from the application's on_frame_end so queued commands run at a
  // safe frame boundary instead of part-way through a frame.
  on_frame_end()
  {
    this.dispatcher.drain();
  }

  dispose()
  {
    this.disposed = true;
    window.clearTimeout(this.retry_timer);

    if (this.socket !== null)
    {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
  }

  private connect()
  {
    const options = this.options;

    if (this.disposed || options === null)
    {
      return;
    }

    const socket = new WebSocket(`ws://127.0.0.1:${options.port}`);
    this.socket = socket;

    socket.onopen = () =>
    {
      socket.send(JSON.stringify({
        event: 'hello',
        protocol: PROTOCOL_VERSION,
        app: options.app_info()
      }));
    };

    socket.onmessage = (message) => this.on_message(message);

    socket.onclose = () =>
    {
      if (this.socket === socket)
      {
        this.socket = null;
      }

      this.schedule_retry();
    };

    // A closed host raises both error and close. Retry is driven by close only.
    socket.onerror = () => {};
  }

  private on_message(message: { data: unknown })
  {
    const raw = message.data;

    if (typeof raw !== 'string')
    {
      return;
    }

    const frame = this.parse_frame(raw);

    if (frame === null)
    {
      return;
    }

    if (frame.event === 'welcome')
    {
      console.info('[ohzi-mcp] bridge connected');
      return;
    }

    if (frame.event === 'refused')
    {
      const reason = this.as_text(frame.reason);
      const server_protocol = this.as_text(frame.server_protocol);

      console.warn(`[ohzi-mcp] bridge refused: ${reason} (server protocol ${server_protocol}, this app speaks ${PROTOCOL_VERSION})`);
      return;
    }

    if (typeof frame.id === 'string' && typeof frame.cmd === 'string')
    {
      this.dispatcher.handle(frame as unknown as Command);
    }
  }

  private parse_frame(raw: string): Record<string, unknown> | null
  {
    try
    {
      const value: unknown = JSON.parse(raw);

      if (typeof value !== 'object' || value === null)
      {
        return null;
      }

      return value as Record<string, unknown>;
    }
    catch
    {
      return null;
    }
  }

  // Never let an object reach a template literal as '[object Object]'.
  private as_text(value: unknown): string
  {
    if (typeof value === 'string')
    {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean')
    {
      return String(value);
    }

    return '(unknown)';
  }

  private send_reply(reply: Reply)
  {
    if (this.socket === null || this.socket.readyState !== WebSocket.OPEN)
    {
      return;
    }

    this.socket.send(JSON.stringify(reply));
  }

  private schedule_retry()
  {
    if (this.disposed)
    {
      return;
    }

    window.clearTimeout(this.retry_timer);
    this.retry_timer = window.setTimeout(() => this.connect(), RETRY_DELAY_MS);
  }
}

export { DevBridge };
