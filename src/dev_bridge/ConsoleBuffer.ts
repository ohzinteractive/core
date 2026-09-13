const DEFAULT_CAPACITY = 200;
const MAX_MESSAGE_LENGTH = 2000;

export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error';

const LEVELS: ConsoleLevel[] = ['log', 'info', 'warn', 'error'];

export interface ConsoleEntry
{
  seq: number;
  level: ConsoleLevel;
  message: string;
  at: number;
}

export interface ConsoleLike
{
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export interface ErrorSource
{
  addEventListener(type: string, listener: (event: unknown) => void): void;
  removeEventListener(type: string, listener: (event: unknown) => void): void;
}

// Read options arrive off the dev-bridge wire and are therefore untrusted.
export interface ConsoleReadOptions
{
  level?: unknown;
  limit?: unknown;
  since?: unknown;
}

export interface ConsoleReadResult
{
  entries: ConsoleEntry[];
  dropped: number;
  total: number;
  capacity: number;
}

// A bounded log of console output and uncaught failures, so the bridge can
// report what a screenshot cannot show. Injected console and error source keep
// this testable outside a browser.
class ConsoleBuffer
{
  private capacity: number;
  private entries: ConsoleEntry[];
  private seq: number;
  private dropped: number;
  private clock: () => number;

  private target: ConsoleLike | null;
  private source: ErrorSource | null;
  private originals: Partial<Record<ConsoleLevel, (...args: unknown[]) => void>>;
  private on_error: ((event: unknown) => void) | null;
  private on_rejection: ((event: unknown) => void) | null;

  constructor(capacity: number = DEFAULT_CAPACITY, clock: () => number = () => Date.now())
  {
    this.capacity = capacity > 0 ? Math.floor(capacity) : DEFAULT_CAPACITY;
    this.entries = [];
    this.seq = 0;
    this.dropped = 0;
    this.clock = clock;
    this.target = null;
    this.source = null;
    this.originals = {};
    this.on_error = null;
    this.on_rejection = null;
  }

  install(target: ConsoleLike, source?: ErrorSource)
  {
    this.dispose();
    this.target = target;

    for (const level of LEVELS)
    {
      // Explicitly typed: indexing with a union then calling .bind() widens to
      // any, which the lint rules reject.
      const original: (...args: unknown[]) => void = target[level];
      this.originals[level] = original;

      target[level] = (...args: unknown[]) =>
      {
        this.push(level, this.format(args));
        original.apply(target, args);
      };
    }

    if (source !== undefined)
    {
      this.source = source;

      this.on_error = (event) => this.push('error', this.event_message(event));
      this.on_rejection = (event) => this.push('error', `Unhandled rejection: ${this.event_reason(event)}`);

      source.addEventListener('error', this.on_error);
      source.addEventListener('unhandledrejection', this.on_rejection);
    }
  }

  dispose()
  {
    const target = this.target;

    if (target !== null)
    {
      for (const level of LEVELS)
      {
        const original = this.originals[level];

        if (original !== undefined)
        {
          target[level] = original;
        }
      }
    }

    const source = this.source;

    if (source !== null)
    {
      if (this.on_error !== null)
      {
        source.removeEventListener('error', this.on_error);
      }

      if (this.on_rejection !== null)
      {
        source.removeEventListener('unhandledrejection', this.on_rejection);
      }
    }

    this.originals = {};
    this.target = null;
    this.source = null;
    this.on_error = null;
    this.on_rejection = null;
  }

  read(options: ConsoleReadOptions): ConsoleReadResult
  {
    const level = typeof options.level === 'string' ? options.level : null;
    const since = typeof options.since === 'number' ? options.since : 0;
    const limit = typeof options.limit === 'number' && options.limit > 0 ? Math.floor(options.limit) : 0;

    let entries = this.entries.filter((entry) => entry.seq > since);

    if (level !== null)
    {
      entries = entries.filter((entry) => entry.level === level);
    }

    if (limit > 0 && entries.length > limit)
    {
      entries = entries.slice(entries.length - limit);
    }

    return { entries, dropped: this.dropped, total: this.seq, capacity: this.capacity };
  }

  private push(level: ConsoleLevel, message: string)
  {
    this.seq++;
    this.entries.push({ seq: this.seq, level, message, at: this.clock() });

    while (this.entries.length > this.capacity)
    {
      this.entries.shift();
      this.dropped++;
    }
  }

  private format(args: unknown[]): string
  {
    const message = args.map((arg) => this.describe(arg)).join(' ');

    if (message.length <= MAX_MESSAGE_LENGTH)
    {
      return message;
    }

    const overflow = message.length - MAX_MESSAGE_LENGTH;

    return `${message.slice(0, MAX_MESSAGE_LENGTH)} ... [truncated ${overflow} chars]`;
  }

  // Deliberately exhaustive: a log line rendered as '[object Object]' is worse
  // than no log line at all.
  private describe(value: unknown): string
  {
    if (typeof value === 'string')
    {
      return value;
    }

    if (value === null)
    {
      return 'null';
    }

    if (value === undefined)
    {
      return 'undefined';
    }

    if (typeof value === 'number' || typeof value === 'boolean')
    {
      return String(value);
    }

    if (typeof value === 'function')
    {
      return '[function]';
    }

    if (typeof value === 'symbol')
    {
      return '[symbol]';
    }

    if (typeof value === 'bigint')
    {
      return `${value.toString()}n`;
    }

    if (value instanceof Error)
    {
      return `${value.name}: ${value.message}`;
    }

    try
    {
      const json = JSON.stringify(value);

      return json === undefined ? '[unserialisable]' : json;
    }
    catch
    {
      return '[unserialisable]';
    }
  }

  private event_message(event: unknown): string
  {
    if (typeof event === 'object' && event !== null)
    {
      const record = event as Record<string, unknown>;

      if (typeof record.message === 'string')
      {
        return record.message;
      }

      if (record.error !== undefined)
      {
        return this.describe(record.error);
      }
    }

    return this.describe(event);
  }

  private event_reason(event: unknown): string
  {
    if (typeof event === 'object' && event !== null)
    {
      const record = event as Record<string, unknown>;

      if (record.reason !== undefined)
      {
        return this.describe(record.reason);
      }
    }

    return this.describe(event);
  }
}

export { ConsoleBuffer };
