import { vi } from 'vitest';

import { WebGPURenderer } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Graphics } from '../../src/Graphics';
import { OrthographicCamera } from '../../src/OrthographicCamera';
import { OScreen } from '../../src/OScreen';

export const SIZE = 64;

// Both WebGPURenderer backends. backend_flag is asserted so a silent fallback to
// WebGL2 can never pass as a WebGPU run.
export const BACKENDS = [
  { name: 'webgpu', force_webgl: false, backend_flag: 'isWebGPUBackend' },
  { name: 'webgl', force_webgl: true, backend_flag: 'isWebGLBackend' }
] as const;

export type Backend = typeof BACKENDS[number];
export type Probe = { x: number, y: number };
export type Rgb = { r: number, g: number, b: number };
export type Pixels = { luminance: (probe: Probe) => number, rgb: (probe: Probe) => Rgb };

export type Harness = {
  renderer: WebGPURenderer,
  reported_errors: unknown[][],
  uses_backend: () => boolean,
  read_canvas: () => Pixels,
  dispose: () => void
};

// A SIZE x SIZE canvas driven through Graphics, with an orthographic camera that maps
// one world unit to one pixel, centered on the origin.
export async function create_harness(backend: Backend): Promise<Harness>
{
  const reported_errors: unknown[][] = [];
  vi.spyOn(console, 'error').mockImplementation((...args) => reported_errors.push(args));
  vi.spyOn(console, 'warn').mockImplementation((...args) => reported_errors.push(args));

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const renderer = new WebGPURenderer({ canvas, antialias: false, forceWebGL: backend.force_webgl });
  await renderer.init();
  renderer.setSize(SIZE, SIZE, false);

  OScreen.init();
  OScreen.update_size(SIZE, SIZE);
  Graphics.init({ renderer, core_attributes: { xr_enabled: false }, dpr: 1 });

  const camera = new OrthographicCamera(-SIZE / 2, SIZE / 2, SIZE / 2, -SIZE / 2, 0.1, 100);
  camera.position.z = 10;
  camera.updateMatrixWorld(true);
  CameraManager.current = camera as never;

  return {
    renderer,
    reported_errors,
    uses_backend: () => (renderer.backend as unknown as Record<string, boolean>)[backend.backend_flag] === true,
    read_canvas: () => read_canvas(canvas),
    dispose: () =>
    {
      renderer.dispose();
      canvas.remove();
      vi.restoreAllMocks();
    }
  };
}

// Must run in the same task as the render, before the browser presents and discards the frame.
function read_canvas(canvas: HTMLCanvasElement): Pixels
{
  const copy = document.createElement('canvas');
  copy.width = SIZE;
  copy.height = SIZE;

  const context = copy.getContext('2d', { willReadFrequently: true });
  context.drawImage(canvas, 0, 0, SIZE, SIZE);

  const data = context.getImageData(0, 0, SIZE, SIZE).data;

  const rgb = ({ x, y }: Probe): Rgb =>
  {
    const i = (y * SIZE + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  };

  return {
    rgb,
    luminance: (probe) =>
    {
      const { r, g, b } = rgb(probe);
      return (r + g + b) / 3;
    }
  };
}
