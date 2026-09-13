import type { Command, Reply } from './protocol';

// `unknown` already absorbs Promise<unknown>; run() normalises both via Promise.resolve.
export type CommandHandler = (args: Record<string, unknown>) => unknown;
export type HandlerTiming = 'immediate' | 'frame_end';

interface Registration
{
  timing: HandlerTiming;
  handler: CommandHandler;
}

interface QueuedCommand
{
  id: string;
  args: Record<string, unknown>;
  handler: CommandHandler;
}

class CommandDispatcher
{
  handlers: Record<string, Registration>;
  queue: QueuedCommand[];

  private reply: (reply: Reply) => void;

  constructor(reply: (reply: Reply) => void)
  {
    this.reply = reply;
    this.handlers = {};
    this.queue = [];
  }

  register(cmd: string, timing: HandlerTiming, handler: CommandHandler)
  {
    this.handlers[cmd] = { timing, handler };
  }

  handle(command: Command)
  {
    const registration = this.handlers[command.cmd];
    const args = command.args === undefined ? {} : command.args;

    if (registration === undefined)
    {
      this.reply({
        id: command.id,
        ok: false,
        error: { code: 'unknown_command', message: `Unknown command '${command.cmd}'` }
      });

      return;
    }

    if (registration.timing === 'frame_end')
    {
      this.queue.push({ id: command.id, args, handler: registration.handler });
      return;
    }

    this.run(command.id, args, registration.handler);
  }

  // Called from MainApplication.on_frame_end() so rendering and mutation
  // never happen part-way through a frame.
  drain()
  {
    const queued = this.queue;
    this.queue = [];

    for (const command of queued)
    {
      this.run(command.id, command.args, command.handler);
    }
  }

  private run(id: string, args: Record<string, unknown>, handler: CommandHandler)
  {
    try
    {
      Promise.resolve(handler(args))
        .then((result) => this.reply({ id, ok: true, result }))
        .catch((error) => this.reply({ id, ok: false, error: this.to_error(error) }));
    }
    catch (error)
    {
      this.reply({ id, ok: false, error: this.to_error(error) });
    }
  }

  private to_error(error: unknown): { code: string; message: string }
  {
    const code = (error as { code?: string })?.code;
    const message = (error as { message?: string })?.message;

    return {
      code: code === undefined ? 'handler_failed' : code,
      message: typeof message === 'string' ? message : this.describe(error)
    };
  }

  // Avoids '[object Object]' reaching the developer for a thrown non-Error.
  private describe(error: unknown): string
  {
    if (typeof error === 'string')
    {
      return error;
    }

    return `Handler failed with a non-Error value of type ${typeof error}`;
  }
}

export { CommandDispatcher };
