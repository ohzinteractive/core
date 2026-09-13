const DEFAULT_HOLD_MS = 60;
const DEFAULT_DRAG_STEPS = 8;
const DEFAULT_DRAG_DURATION_MS = 240;
const MAX_DRAG_STEPS = 120;
// Bounded so a caller cannot request a gesture that outlives the command timeout.
const MAX_DURATION_MS = 10000;
const MAX_HOLD_MS = 10000;

const BUTTONS: Record<string, number> = { left: 0, middle: 1, right: 2 };

export type DispatchEvent = (type: string, init: Record<string, unknown>) => void;
export type Sleep = (ms: number) => Promise<void>;
export type ToClient = (x: number, y: number, space: string) => { x: number; y: number };

export interface PointerRequest
{
  action?: unknown;
  x?: unknown;
  y?: unknown;
  button?: unknown;
  space?: unknown;
  hold_ms?: unknown;
}

export interface DragRequest
{
  from?: unknown;
  to?: unknown;
  steps?: unknown;
  duration_ms?: unknown;
  button?: unknown;
  space?: unknown;
}

export interface ScrollRequest
{
  delta?: unknown;
  x?: unknown;
  y?: unknown;
  space?: unknown;
}

export interface KeyRequest
{
  code?: unknown;
  action?: unknown;
  hold_ms?: unknown;
}

export interface InputResult
{
  dispatched: string[];
  at?: number[];
  from?: number[];
  to?: number[];
  code?: string;
  delta?: number;
}

// Drives real DOM events at the element PIT already listens on, rather than
// writing into PIT's state. That way the whole genuine path runs: the region
// maths, Pointer bookkeeping, and any Input subclass deriving clicked or
// swiped from the raw flags. A parallel fake input module would drift from it.
//
// Timing matters. PIT clears pressed and released at the end of every frame, so
// a press and its release must be separated by real time for the application's
// update to observe them. Hence the sleeps rather than back-to-back dispatch.
class InputSynthesizer
{
  private dispatch: DispatchEvent;
  private sleep: Sleep;
  private to_client: ToClient;

  constructor(dispatch: DispatchEvent, sleep: Sleep, to_client: ToClient)
  {
    this.dispatch = dispatch;
    this.sleep = sleep;
    this.to_client = to_client;
  }

  async pointer(request: PointerRequest): Promise<InputResult>
  {
    const action = this.text(request.action, 'click');
    const space = this.space(request.space);
    const point = this.point(request.x, request.y, space);
    const button = this.button(request.button);
    const hold = Math.min(MAX_HOLD_MS, this.positive(request.hold_ms, DEFAULT_HOLD_MS));
    const dispatched: string[] = [];

    if (action === 'move' || action === 'down' || action === 'click')
    {
      this.send('mousemove', { clientX: point.x, clientY: point.y });
      dispatched.push('mousemove');
    }

    if (action === 'down' || action === 'click')
    {
      this.send('mousedown', { clientX: point.x, clientY: point.y, button });
      dispatched.push('mousedown');
    }

    if (action === 'click')
    {
      await this.sleep(hold);
    }

    if (action === 'up' || action === 'click')
    {
      this.send('mouseup', { clientX: point.x, clientY: point.y, button });
      dispatched.push('mouseup');
    }

    if (dispatched.length === 0)
    {
      throw this.error('bad_request', `Unknown pointer action '${action}'. Use click, down, up or move.`);
    }

    return { dispatched, at: [point.x, point.y] };
  }

  async drag(request: DragRequest): Promise<InputResult>
  {
    const space = this.space(request.space);
    const from = this.pair(request.from, space, 'from');
    const to = this.pair(request.to, space, 'to');
    const steps = Math.min(MAX_DRAG_STEPS, Math.max(1, Math.floor(this.positive(request.steps, DEFAULT_DRAG_STEPS))));
    const duration = Math.min(MAX_DURATION_MS, this.positive(request.duration_ms, DEFAULT_DRAG_DURATION_MS));
    const button = this.button(request.button);
    const dispatched: string[] = [];

    this.send('mousemove', { clientX: from.x, clientY: from.y });
    dispatched.push('mousemove');

    this.send('mousedown', { clientX: from.x, clientY: from.y, button });
    dispatched.push('mousedown');

    for (let step = 1; step <= steps; step++)
    {
      const t = step / steps;

      await this.sleep(duration / steps);

      this.send('mousemove', {
        clientX: from.x + (to.x - from.x) * t,
        clientY: from.y + (to.y - from.y) * t
      });

      dispatched.push('mousemove');
    }

    this.send('mouseup', { clientX: to.x, clientY: to.y, button });
    dispatched.push('mouseup');

    return { dispatched, from: [from.x, from.y], to: [to.x, to.y] };
  }

  // Not async: a wheel event is a single dispatch with nothing to wait on.
  // The Promise return keeps the four methods interchangeable for the caller.
  scroll(request: ScrollRequest): Promise<InputResult>
  {
    const delta = this.number(request.delta);

    if (delta === null)
    {
      throw this.error('bad_request', 'scroll requires a numeric delta.');
    }

    const space = this.space(request.space);
    const point = this.point(request.x === undefined ? 0 : request.x, request.y === undefined ? 0 : request.y, space);

    this.send('wheel', { clientX: point.x, clientY: point.y, deltaY: delta });

    return Promise.resolve({ dispatched: ['wheel'], at: [point.x, point.y], delta });
  }

  async key(request: KeyRequest): Promise<InputResult>
  {
    const code = typeof request.code === 'string' && request.code.length > 0 ? request.code : null;

    if (code === null)
    {
      throw this.error('bad_request', "key requires a code, for example 'Space' or 'KeyW'.");
    }

    const action = this.text(request.action, 'press');
    const hold = Math.min(MAX_HOLD_MS, this.positive(request.hold_ms, DEFAULT_HOLD_MS));
    const dispatched: string[] = [];

    if (action === 'down' || action === 'press')
    {
      this.send('keydown', { code, key: code });
      dispatched.push('keydown');
    }

    if (action === 'press')
    {
      await this.sleep(hold);
    }

    if (action === 'up' || action === 'press')
    {
      this.send('keyup', { code, key: code });
      dispatched.push('keyup');
    }

    if (dispatched.length === 0)
    {
      throw this.error('bad_request', `Unknown key action '${action}'. Use press, down or up.`);
    }

    return { dispatched, code };
  }

  private send(type: string, init: Record<string, unknown>): void
  {
    this.dispatch(type, { ...init, bubbles: true, cancelable: true });
  }

  private point(x: unknown, y: unknown, space: string): { x: number; y: number }
  {
    const px = this.number(x);
    const py = this.number(y);

    if (px === null || py === null)
    {
      throw this.error('bad_request', 'x and y must be numbers.');
    }

    return this.to_client(px, py, space);
  }

  private pair(value: unknown, space: string, label: string): { x: number; y: number }
  {
    if (!Array.isArray(value) || value.length < 2)
    {
      throw this.error('bad_request', `${label} must be [x, y].`);
    }

    const supplied = value as unknown[];

    return this.point(supplied[0], supplied[1], space);
  }

  private space(value: unknown): string
  {
    return value === 'ndc' ? 'ndc' : 'pixels';
  }

  private button(value: unknown): number
  {
    if (typeof value !== 'string')
    {
      return 0;
    }

    const mapped = BUTTONS[value.toLowerCase()];

    return mapped === undefined ? 0 : mapped;
  }

  private text(value: unknown, fallback: string): string
  {
    return typeof value === 'string' && value.length > 0 ? value.toLowerCase() : fallback;
  }

  private number(value: unknown): number | null
  {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private positive(value: unknown, fallback: number): number
  {
    const parsed = this.number(value);

    return parsed === null || parsed <= 0 ? fallback : parsed;
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { InputSynthesizer };
