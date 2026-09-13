import { describe, expect, it } from 'vitest';
import { ConsoleBuffer } from '../../src/dev_bridge/ConsoleBuffer';

interface Captured
{
  level: string;
  args: unknown[];
}

function fake_console(captured: Captured[])
{
  return {
    log: (...args: unknown[]) => captured.push({ level: 'log', args }),
    info: (...args: unknown[]) => captured.push({ level: 'info', args }),
    warn: (...args: unknown[]) => captured.push({ level: 'warn', args }),
    error: (...args: unknown[]) => captured.push({ level: 'error', args })
  };
}

type Listener = (event: unknown) => void;

class FakeErrorSource
{
  listeners: Record<string, Listener[]> = {};

  addEventListener(type: string, listener: Listener)
  {
    this.listeners[type] = this.listeners[type] ?? [];
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: Listener)
  {
    this.listeners[type] = (this.listeners[type] ?? []).filter((l) => l !== listener);
  }

  emit(type: string, event: unknown)
  {
    for (const listener of this.listeners[type] ?? [])
    {
      listener(event);
    }
  }
}

function installed(capacity?: number)
{
  const captured: Captured[] = [];
  const target = fake_console(captured);
  const source = new FakeErrorSource();
  const buffer = new ConsoleBuffer(capacity);

  buffer.install(target, source);

  return { buffer, target, source, captured };
}

describe('ConsoleBuffer capture', () =>
{
  it('records every level and still calls through to the real console', () =>
  {
    const { buffer, target, captured } = installed();

    target.log('a');
    target.info('b');
    target.warn('c');
    target.error('d');

    expect(captured.map((c) => c.level)).toEqual(['log', 'info', 'warn', 'error']);

    const entries = buffer.read({}).entries;
    expect(entries.map((e) => e.level)).toEqual(['log', 'info', 'warn', 'error']);
    expect(entries.map((e) => e.message)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('numbers entries with an increasing seq', () =>
  {
    const { buffer, target } = installed();

    target.log('first');
    target.log('second');

    const entries = buffer.read({}).entries;
    expect(entries[0].seq).toBe(1);
    expect(entries[1].seq).toBe(2);
  });

  it('joins multiple arguments', () =>
  {
    const { buffer, target } = installed();

    target.warn('count', 42, true);

    expect(buffer.read({}).entries[0].message).toBe('count 42 true');
  });

  it('restores the original methods on dispose', () =>
  {
    const { buffer, target, captured } = installed();
    const patched = target.log;

    buffer.dispose();

    expect(target.log).not.toBe(patched);
    target.log('after');

    expect(captured).toHaveLength(1);
    expect(buffer.read({}).entries).toHaveLength(0);
  });
});

describe('ConsoleBuffer formatting', () =>
{
  it('never renders an object as [object Object]', () =>
  {
    const { buffer, target } = installed();

    target.log({ a: 1 });

    const message = buffer.read({}).entries[0].message;
    expect(message).not.toContain('[object Object]');
    expect(message).toBe('{"a":1}');
  });

  it('renders an Error with its name and message', () =>
  {
    const { buffer, target } = installed();

    target.error(new TypeError('boom'));

    expect(buffer.read({}).entries[0].message).toBe('TypeError: boom');
  });

  it('renders null, undefined and a function safely', () =>
  {
    const { buffer, target } = installed();

    target.log(null, undefined, () => 1);

    expect(buffer.read({}).entries[0].message).toBe('null undefined [function]');
  });

  it('survives a circular structure', () =>
  {
    const { buffer, target } = installed();
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    target.log(circular);

    expect(buffer.read({}).entries[0].message).toBe('[unserialisable]');
  });

  it('truncates an enormous message', () =>
  {
    const { buffer, target } = installed();

    target.log('x'.repeat(5000));

    const message = buffer.read({}).entries[0].message;
    expect(message.length).toBeLessThan(2100);
    expect(message).toContain('truncated');
  });
});

describe('ConsoleBuffer reading', () =>
{
  it('filters by level', () =>
  {
    const { buffer, target } = installed();

    target.log('l');
    target.error('e');
    target.warn('w');

    expect(buffer.read({ level: 'error' }).entries.map((e) => e.message)).toEqual(['e']);
  });

  it('returns the most recent entries when limited', () =>
  {
    const { buffer, target } = installed();

    target.log('1');
    target.log('2');
    target.log('3');

    expect(buffer.read({ limit: 2 }).entries.map((e) => e.message)).toEqual(['2', '3']);
  });

  it('returns only entries after the given seq', () =>
  {
    const { buffer, target } = installed();

    target.log('1');
    target.log('2');
    target.log('3');

    expect(buffer.read({ since: 2 }).entries.map((e) => e.message)).toEqual(['3']);
  });

  it('drops the oldest entries past capacity and reports how many', () =>
  {
    const { buffer, target } = installed(3);

    target.log('1');
    target.log('2');
    target.log('3');
    target.log('4');

    const result = buffer.read({});
    expect(result.entries.map((e) => e.message)).toEqual(['2', '3', '4']);
    expect(result.dropped).toBe(1);
    expect(result.total).toBe(4);
  });
});

describe('ConsoleBuffer uncaught failures', () =>
{
  it('records an uncaught error event', () =>
  {
    const { buffer, source } = installed();

    source.emit('error', { message: 'Uncaught TypeError: x is not a function' });

    const entry = buffer.read({}).entries[0];
    expect(entry.level).toBe('error');
    expect(entry.message).toContain('x is not a function');
  });

  it('records an unhandled rejection', () =>
  {
    const { buffer, source } = installed();

    source.emit('unhandledrejection', { reason: new Error('no network') });

    const entry = buffer.read({}).entries[0];
    expect(entry.level).toBe('error');
    expect(entry.message).toContain('no network');
  });

  it('stops listening after dispose', () =>
  {
    const { buffer, source } = installed();

    buffer.dispose();
    source.emit('error', { message: 'late' });

    expect(buffer.read({}).entries).toHaveLength(0);
  });
});
