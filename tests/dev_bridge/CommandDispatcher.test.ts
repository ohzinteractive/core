import { describe, expect, it, vi } from 'vitest';
import { CommandDispatcher } from '../../src/dev_bridge/CommandDispatcher';

describe('CommandDispatcher', () =>
{
  it('answers an immediate command without waiting for a frame', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);

    dispatcher.register('status', 'immediate', () => ({ active_view: 'home' }));
    dispatcher.handle({ id: 'c1', cmd: 'status', args: {} });

    await vi.waitFor(() => expect(reply).toHaveBeenCalledTimes(1));
    expect(reply).toHaveBeenCalledWith({ id: 'c1', ok: true, result: { active_view: 'home' } });
  });

  it('defers a frame_end command until drain is called', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);

    dispatcher.register('capture', 'frame_end', () => 'png');
    dispatcher.handle({ id: 'c1', cmd: 'capture', args: {} });

    expect(reply).not.toHaveBeenCalled();

    dispatcher.drain();

    await vi.waitFor(() => expect(reply).toHaveBeenCalledWith({ id: 'c1', ok: true, result: 'png' }));
  });

  it('drains queued commands in order and empties the queue', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);
    const seen: string[] = [];

    dispatcher.register('step', 'frame_end', (args) =>
    {
      seen.push(args.label as string);
      return args.label;
    });

    dispatcher.handle({ id: 'c1', cmd: 'step', args: { label: 'a' } });
    dispatcher.handle({ id: 'c2', cmd: 'step', args: { label: 'b' } });
    dispatcher.drain();

    await vi.waitFor(() => expect(reply).toHaveBeenCalledTimes(2));
    expect(seen).toEqual(['a', 'b']);

    reply.mockClear();
    dispatcher.drain();
    expect(reply).not.toHaveBeenCalled();
  });

  it('replies unknown_command for an unregistered command', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);

    dispatcher.handle({ id: 'c1', cmd: 'nope', args: {} });

    await vi.waitFor(() => expect(reply).toHaveBeenCalledTimes(1));
    expect(reply.mock.calls[0][0]).toMatchObject({ id: 'c1', ok: false, error: { code: 'unknown_command' } });
  });

  it('maps a thrown error to handler_failed and keeps the message', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);

    dispatcher.register('boom', 'immediate', () =>
    {
      throw new Error('exploded');
    });

    dispatcher.handle({ id: 'c1', cmd: 'boom', args: {} });

    await vi.waitFor(() => expect(reply).toHaveBeenCalledTimes(1));
    expect(reply.mock.calls[0][0]).toMatchObject({
      id: 'c1',
      ok: false,
      error: { code: 'handler_failed', message: 'exploded' }
    });
  });

  it('preserves an explicit error code thrown by a handler', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);

    dispatcher.register('get_camera', 'immediate', () =>
    {
      const error: Error & { code?: string } = new Error('CameraManager.current is undefined');
      error.code = 'no_camera';
      throw error;
    });

    dispatcher.handle({ id: 'c1', cmd: 'get_camera', args: {} });

    await vi.waitFor(() => expect(reply).toHaveBeenCalledTimes(1));
    expect(reply.mock.calls[0][0]).toMatchObject({ id: 'c1', ok: false, error: { code: 'no_camera' } });
  });

  it('resolves an async handler', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);

    dispatcher.register('slow', 'immediate', async () => 'done');
    dispatcher.handle({ id: 'c1', cmd: 'slow', args: {} });

    await vi.waitFor(() => expect(reply).toHaveBeenCalledWith({ id: 'c1', ok: true, result: 'done' }));
  });

  it('treats a missing args object as empty', async () =>
  {
    const reply = vi.fn();
    const dispatcher = new CommandDispatcher(reply);

    dispatcher.register('status', 'immediate', (args) => Object.keys(args).length);
    dispatcher.handle({ id: 'c1', cmd: 'status' });

    await vi.waitFor(() => expect(reply).toHaveBeenCalledWith({ id: 'c1', ok: true, result: 0 }));
  });
});
