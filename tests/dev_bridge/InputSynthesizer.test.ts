import { describe, expect, it } from 'vitest';
import { InputSynthesizer } from '../../src/dev_bridge/InputSynthesizer';

interface Dispatched
{
  type: string;
  init: Record<string, unknown>;
}

function harness()
{
  const events: Dispatched[] = [];
  const waits: number[] = [];

  const synthesizer = new InputSynthesizer(
    (type, init) => events.push({ type, init }),
    async (ms) => { waits.push(ms); },
    // Canvas at viewport offset 100,50 sized 800x600.
    (x, y, space) => space === 'ndc'
      ? { x: 100 + ((x + 1) / 2) * 800, y: 50 + ((1 - y) / 2) * 600 }
      : { x: 100 + x, y: 50 + y }
  );

  return { synthesizer, events, waits };
}

function types(events: Dispatched[]): string[]
{
  return events.map((e) => e.type);
}

describe('InputSynthesizer pointer', () =>
{
  it('clicks by moving, pressing, holding and releasing', async () =>
  {
    const { synthesizer, events, waits } = harness();

    await synthesizer.pointer({ action: 'click', x: 10, y: 20 });

    expect(types(events)).toEqual(['mousemove', 'mousedown', 'mouseup']);
    expect(events[1].init).toMatchObject({ clientX: 110, clientY: 70, button: 0 });
    expect(waits.length).toBeGreaterThan(0);
  });

  it('honours an explicit hold', async () =>
  {
    const { synthesizer, waits } = harness();

    await synthesizer.pointer({ action: 'click', x: 0, y: 0, hold_ms: 250 });

    expect(waits).toContain(250);
  });

  it('bounds an absurd hold', async () =>
  {
    const { synthesizer, waits } = harness();

    await synthesizer.pointer({ action: 'click', x: 0, y: 0, hold_ms: 600000 });

    expect(waits).toEqual([10000]);
  });

  it('presses without releasing for action down', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.pointer({ action: 'down', x: 5, y: 5 });

    expect(types(events)).toEqual(['mousemove', 'mousedown']);
  });

  it('releases only for action up', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.pointer({ action: 'up', x: 5, y: 5 });

    expect(types(events)).toEqual(['mouseup']);
  });

  it('moves only for action move', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.pointer({ action: 'move', x: 5, y: 5 });

    expect(types(events)).toEqual(['mousemove']);
  });

  it('maps the right button to button 2', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.pointer({ action: 'click', x: 0, y: 0, button: 'right' });

    expect(events[1].init.button).toBe(2);
  });

  it('converts ndc coordinates through the injected resolver', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.pointer({ action: 'move', x: 0, y: 0, space: 'ndc' });

    expect(events[0].init).toMatchObject({ clientX: 500, clientY: 350 });
  });

  it('rejects an unknown action', async () =>
  {
    const { synthesizer } = harness();

    await expect(synthesizer.pointer({ action: 'wiggle', x: 0, y: 0 })).rejects.toMatchObject({ code: 'bad_request' });
  });

  it('rejects non-numeric coordinates', async () =>
  {
    const { synthesizer } = harness();

    await expect(synthesizer.pointer({ action: 'click', x: 'left', y: 0 })).rejects.toMatchObject({ code: 'bad_request' });
  });
});

describe('InputSynthesizer drag', () =>
{
  it('presses, moves through interpolated points and releases', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.drag({ from: [0, 0], to: [80, 40], steps: 4 });

    expect(types(events)).toEqual([
      'mousemove', 'mousedown',
      'mousemove', 'mousemove', 'mousemove', 'mousemove',
      'mouseup'
    ]);

    // Final move lands on the destination.
    expect(events[5].init).toMatchObject({ clientX: 180, clientY: 90 });
  });

  it('interpolates towards the destination', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.drag({ from: [0, 0], to: [80, 40], steps: 2 });

    expect(events[2].init).toMatchObject({ clientX: 140, clientY: 70 });
  });

  it('bounds an absurd duration so it cannot outlive the command timeout', async () =>
  {
    const { synthesizer, waits } = harness();

    await synthesizer.drag({ from: [0, 0], to: [10, 10], steps: 1, duration_ms: 600000 });

    expect(waits).toEqual([10000]);
  });

  it('rejects a malformed endpoint', async () =>
  {
    const { synthesizer } = harness();

    await expect(synthesizer.drag({ from: [0], to: [1, 2] })).rejects.toMatchObject({ code: 'bad_request' });
  });
});

describe('InputSynthesizer scroll and keys', () =>
{
  it('dispatches a wheel event carrying the delta', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.scroll({ delta: -120, x: 10, y: 10 });

    expect(events[0].type).toBe('wheel');
    expect(events[0].init).toMatchObject({ deltaY: -120, clientX: 110, clientY: 60 });
  });

  it('presses and releases a key', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.key({ code: 'Space', action: 'press' });

    expect(types(events)).toEqual(['keydown', 'keyup']);
    expect(events[0].init).toMatchObject({ code: 'Space' });
  });

  it('holds a key down without releasing', async () =>
  {
    const { synthesizer, events } = harness();

    await synthesizer.key({ code: 'KeyW', action: 'down' });

    expect(types(events)).toEqual(['keydown']);
  });

  it('rejects a missing key code', async () =>
  {
    const { synthesizer } = harness();

    await expect(synthesizer.key({ action: 'press' })).rejects.toMatchObject({ code: 'bad_request' });
  });
});
