import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DevBridge } from '../../src/dev_bridge/DevBridge';
import { PROTOCOL_VERSION } from '../../src/dev_bridge/protocol';

const app_info = {
  core_version: '13.3.0',
  components_version: '4.1.0',
  pit_version: '5.0.4',
  active_view: 'home',
  has_camera: true,
  canvas: { width: 1280, height: 720, dpr: 2 }
};

class FakeSocket
{
  static OPEN = 1;
  static CLOSED = 3;
  static instances: FakeSocket[] = [];

  url: string;
  readyState = FakeSocket.OPEN;
  sent: string[] = [];

  onopen: (() => void) | null = null;
  onmessage: ((message: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(url: string)
  {
    this.url = url;
    FakeSocket.instances.push(this);
  }

  send(data: string)
  {
    this.sent.push(data);
  }

  close()
  {
    this.readyState = FakeSocket.CLOSED;

    if (this.onclose !== null)
    {
      this.onclose();
    }
  }

  // Test helpers
  open_it()
  {
    if (this.onopen !== null)
    {
      this.onopen();
    }
  }

  receive(payload: unknown)
  {
    if (this.onmessage !== null)
    {
      this.onmessage({ data: JSON.stringify(payload) });
    }
  }
}

function latest(): FakeSocket
{
  return FakeSocket.instances[FakeSocket.instances.length - 1];
}

beforeEach(() =>
{
  FakeSocket.instances = [];
  (globalThis as any).WebSocket = FakeSocket;
  (globalThis as any).window = globalThis;
  vi.useFakeTimers();
});

afterEach(() =>
{
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('DevBridge handshake', () =>
{
  it('connects to the configured port', () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 9123, app_info: () => app_info });

    expect(latest().url).toBe('ws://127.0.0.1:9123');
  });

  it('sends hello with the protocol version and app info on open', () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 7317, app_info: () => app_info });

    latest().open_it();

    const hello = JSON.parse(latest().sent[0]);

    expect(hello.event).toBe('hello');
    expect(hello.protocol).toBe(PROTOCOL_VERSION);
    expect(hello.app.core_version).toBe('13.3.0');
    expect(hello.app.active_view).toBe('home');
  });

  it('reads app info fresh at handshake time rather than at init time', () =>
  {
    let view = 'home';
    const bridge = new DevBridge();

    bridge.init({ port: 7317, app_info: () => ({ ...app_info, active_view: view }) });

    view = 'landing';
    latest().open_it();

    expect(JSON.parse(latest().sent[0]).app.active_view).toBe('landing');
  });

  it('warns naming both versions when the host refuses', () =>
  {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const bridge = new DevBridge();

    bridge.init({ port: 7317, app_info: () => app_info });
    latest().receive({ event: 'refused', reason: 'Protocol mismatch.', server_protocol: 99, client_protocol: 1 });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('99');
    expect(warn.mock.calls[0][0]).toContain(String(PROTOCOL_VERSION));
  });

  it('ignores a malformed frame without throwing', () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 7317, app_info: () => app_info });

    expect(() =>
    {
      latest().onmessage!({ data: 'not json{' });
    }).not.toThrow();
  });
});

describe('DevBridge commands', () =>
{
  it('routes a command to its handler and replies on the socket', async () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 7317, app_info: () => app_info });
    bridge.register('status', 'immediate', () => ({ active_view: 'home' }));

    latest().open_it();
    latest().receive({ id: 'c1', cmd: 'status', args: {} });

    await vi.waitFor(() => expect(latest().sent.length).toBe(2));

    expect(JSON.parse(latest().sent[1])).toEqual({ id: 'c1', ok: true, result: { active_view: 'home' } });
  });

  it('defers a frame_end command until on_frame_end runs', async () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 7317, app_info: () => app_info });
    bridge.register('capture', 'frame_end', () => 'png');

    latest().open_it();
    latest().receive({ id: 'c1', cmd: 'capture', args: {} });

    expect(latest().sent.length).toBe(1);

    bridge.on_frame_end();

    await vi.waitFor(() => expect(latest().sent.length).toBe(2));
    expect(JSON.parse(latest().sent[1]).result).toBe('png');
  });
});

describe('DevBridge reconnection', () =>
{
  it('retries after the socket closes', () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 7317, app_info: () => app_info });

    expect(FakeSocket.instances.length).toBe(1);

    latest().close();
    vi.advanceTimersByTime(2000);

    expect(FakeSocket.instances.length).toBe(2);
  });

  it('does not retry after dispose', () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 7317, app_info: () => app_info });

    bridge.dispose();
    vi.advanceTimersByTime(10000);

    expect(FakeSocket.instances.length).toBe(1);
  });

  it('does not retry when disposed while a retry is already scheduled', () =>
  {
    const bridge = new DevBridge();
    bridge.init({ port: 7317, app_info: () => app_info });

    latest().close();
    bridge.dispose();
    vi.advanceTimersByTime(10000);

    expect(FakeSocket.instances.length).toBe(1);
  });
});
