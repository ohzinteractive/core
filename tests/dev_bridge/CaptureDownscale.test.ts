import { describe, expect, it } from 'vitest';
import { CaptureService } from '../../src/dev_bridge/CaptureService';

const png_bytes = new Uint8Array([137, 80, 78, 71, 1, 2]);

function blob(): Blob
{
  return new Blob([png_bytes], { type: 'image/png' });
}

interface Recorded
{
  source_toBlob: number;
  scratch_toBlob: number;
  scratch_size?: { width: number; height: number };
  drawn?: { width: number; height: number };
  screenshot_size?: { width?: number; height?: number };
  context_available: boolean;
}

function harness(canvas_width: number, canvas_height: number, recorded: Recorded)
{
  const graphics = {
    canvas: {
      width: canvas_width,
      height: canvas_height,
      toBlob(callback: (b: Blob | null) => void)
      {
        recorded.source_toBlob++;
        callback(blob());
      }
    },
    take_screenshot(callback: (b: Blob | null) => void, width?: number, height?: number)
    {
      recorded.screenshot_size = { width, height };
      callback(blob());
    }
  };

  const create_canvas = () =>
  {
    const scratch = {
      width: 0,
      height: 0,
      getContext: () =>
      {
        if (!recorded.context_available)
        {
          return null;
        }

        return {
          drawImage: (_source: unknown, _x: number, _y: number, width: number, height: number) =>
          {
            recorded.drawn = { width, height };
          }
        };
      },
      toBlob(callback: (b: Blob | null) => void)
      {
        recorded.scratch_toBlob++;
        recorded.scratch_size = { width: scratch.width, height: scratch.height };
        callback(blob());
      }
    };

    return scratch;
  };

  return new CaptureService(graphics, () => true, create_canvas);
}

function fresh(): Recorded
{
  return { source_toBlob: 0, scratch_toBlob: 0, context_available: true };
}

describe('fast capture downscaling', () =>
{
  it('caps the long edge at 1280 by default and preserves aspect', async () =>
  {
    const recorded = fresh();
    const result = await harness(1668, 1540, recorded).capture({});

    expect(result.width).toBe(1280);
    expect(result.height).toBe(1182);
    expect(result.scaled_from).toEqual({ width: 1668, height: 1540 });
    expect(recorded.scratch_size).toEqual({ width: 1280, height: 1182 });
    expect(recorded.drawn).toEqual({ width: 1280, height: 1182 });
  });

  it('reads the scaled canvas, not the source canvas', async () =>
  {
    const recorded = fresh();
    await harness(1668, 1540, recorded).capture({});

    expect(recorded.scratch_toBlob).toBe(1);
    expect(recorded.source_toBlob).toBe(0);
  });

  it('caps the height when the canvas is portrait', async () =>
  {
    const recorded = fresh();
    const result = await harness(800, 2000, recorded).capture({});

    expect(result.height).toBe(1280);
    expect(result.width).toBe(512);
  });

  it('honours an explicit max_size', async () =>
  {
    const recorded = fresh();
    const result = await harness(1668, 1540, recorded).capture({ max_size: 400 });

    expect(result.width).toBe(400);
    expect(result.height).toBe(369);
  });

  it('never upscales a canvas smaller than the cap', async () =>
  {
    const recorded = fresh();
    const result = await harness(640, 480, recorded).capture({});

    expect(result.width).toBe(640);
    expect(result.height).toBe(480);
    expect(result.scaled_from).toBeUndefined();
    expect(recorded.source_toBlob).toBe(1);
    expect(recorded.scratch_toBlob).toBe(0);
  });

  it('returns native pixels when max_size is 0', async () =>
  {
    const recorded = fresh();
    const result = await harness(1668, 1540, recorded).capture({ max_size: 0 });

    expect(result.width).toBe(1668);
    expect(result.height).toBe(1540);
    expect(recorded.source_toBlob).toBe(1);
  });

  it('ignores a non-numeric max_size and uses the default', async () =>
  {
    const recorded = fresh();
    const result = await harness(1668, 1540, recorded).capture({ max_size: 'big' });

    expect(result.width).toBe(1280);
  });

  it('falls back to the native capture when no 2d context is available', async () =>
  {
    const recorded = fresh();
    recorded.context_available = false;

    const result = await harness(1668, 1540, recorded).capture({});

    expect(result.width).toBe(1668);
    expect(result.scaled_from).toBeUndefined();
    expect(recorded.source_toBlob).toBe(1);
  });
});

describe('hires capture is unaffected by max_size', () =>
{
  it('does not downscale an explicitly requested size', async () =>
  {
    const recorded = fresh();
    const result = await harness(1668, 1540, recorded).capture({ mode: 'hires', width: 2560, height: 1440, max_size: 400 });

    expect(recorded.screenshot_size).toEqual({ width: 2560, height: 1440 });
    expect(result.width).toBe(2560);
    expect(result.scaled_from).toBeUndefined();
    expect(recorded.scratch_toBlob).toBe(0);
  });
});
