import { describe, expect, it } from 'vitest';
import { CaptureService } from '../../src/dev_bridge/CaptureService';

const png_bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);

function png_blob(): Blob
{
  return new Blob([png_bytes], { type: 'image/png' });
}

function decode(base64: string): Uint8Array
{
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++)
  {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

interface Recorded
{
  width?: number;
  height?: number;
  called: number;
}

function fake_graphics(blob: Blob | null, recorded: Recorded)
{
  return {
    canvas: {
      width: 1280,
      height: 720,
      toBlob(callback: (b: Blob | null) => void)
      {
        recorded.called++;
        callback(blob);
      }
    },
    take_screenshot(callback: (b: Blob | null) => void, width?: number, height?: number)
    {
      recorded.called++;
      recorded.width = width;
      recorded.height = height;
      callback(blob);
    }
  };
}

describe('CaptureService fast mode', () =>
{
  it('returns base64 png data at the canvas size', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(png_blob(), recorded), () => true);

    const result = await service.capture({ mode: 'fast' });

    expect(result.mode).toBe('fast');
    expect(result.mime_type).toBe('image/png');
    expect(result.width).toBe(1280);
    expect(result.height).toBe(720);
    expect(result.bytes).toBe(png_bytes.length);
    expect(decode(result.data)).toEqual(png_bytes);
  });

  it('defaults to fast when no mode is given', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(png_blob(), recorded), () => true);

    expect((await service.capture({})).mode).toBe('fast');
    expect(recorded.width).toBeUndefined();
  });

  it('does not require a camera', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(png_blob(), recorded), () => false);

    await expect(service.capture({ mode: 'fast' })).resolves.toBeTruthy();
  });
});

describe('CaptureService hires mode', () =>
{
  it('passes the requested size to take_screenshot', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(png_blob(), recorded), () => true);

    const result = await service.capture({ mode: 'hires', width: 2560, height: 1440 });

    expect(recorded.width).toBe(2560);
    expect(recorded.height).toBe(1440);
    expect(result.mode).toBe('hires');
    expect(result.width).toBe(2560);
  });

  it('falls back to the canvas size when no size is given', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(png_blob(), recorded), () => true);

    await service.capture({ mode: 'hires' });

    expect(recorded.width).toBe(1280);
    expect(recorded.height).toBe(720);
  });

  it('clamps an absurd size instead of hanging the renderer', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(png_blob(), recorded), () => true);

    await service.capture({ mode: 'hires', width: 999999, height: 999999 });

    expect(recorded.width).toBe(8192);
    expect(recorded.height).toBe(8192);
  });

  it('rejects with no_camera because take_screenshot dereferences CameraManager.current', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(png_blob(), recorded), () => false);

    await expect(service.capture({ mode: 'hires' })).rejects.toMatchObject({ code: 'no_camera' });
    expect(recorded.called).toBe(0);
  });
});

describe('CaptureService failures', () =>
{
  it('rejects with capture_failed when the canvas yields no blob', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const service = new CaptureService(fake_graphics(null, recorded), () => true);

    await expect(service.capture({ mode: 'fast' })).rejects.toMatchObject({ code: 'capture_failed' });
  });

  it('reports image/png even when the blob carries the malformed type Graphics requests', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const odd = new Blob([png_bytes], { type: 'image/png;base64;' });
    const service = new CaptureService(fake_graphics(odd, recorded), () => true);

    expect((await service.capture({ mode: 'hires' })).mime_type).toBe('image/png');
  });

  it('encodes a payload larger than one chunk without overflowing the stack', async () =>
  {
    const recorded: Recorded = { called: 0 };
    const big = new Uint8Array(70000).fill(7);
    const service = new CaptureService(fake_graphics(new Blob([big]), recorded), () => true);

    const result = await service.capture({ mode: 'fast' });

    expect(result.bytes).toBe(70000);
    expect(decode(result.data).length).toBe(70000);
  });
});
