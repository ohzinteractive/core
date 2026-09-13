const MAX_DIMENSION = 8192;
const BASE64_CHUNK_SIZE = 8192;

// A retina canvas reports physical pixels, so a fast capture is 4x the pixels
// the developer is actually looking at. Every one of those bytes is base64'd
// into the model's context, so cap the long edge unless asked otherwise.
const DEFAULT_MAX_FAST_SIZE = 1280;

export interface CaptureCanvas
{
  width: number;
  height: number;
  toBlob(callback: (blob: Blob | null) => void, type?: string): void;
}

export interface ScratchContext
{
  drawImage(source: unknown, x: number, y: number, width: number, height: number): void;
}

export interface ScratchCanvas
{
  width: number;
  height: number;
  getContext(type: '2d'): ScratchContext | null;
  toBlob(callback: (blob: Blob | null) => void, type?: string): void;
}

export interface CaptureGraphics
{
  canvas: CaptureCanvas;
  take_screenshot(callback: (blob: Blob | null) => void, width?: number, height?: number): void;
}

// Values arrive straight off the dev-bridge wire, so they are untrusted and
// every field is validated before use.
export interface CaptureOptions
{
  mode?: unknown;
  width?: unknown;
  height?: unknown;
  max_size?: unknown;
}

export interface CaptureResult
{
  mode: 'fast' | 'hires';
  mime_type: string;
  width: number;
  height: number;
  bytes: number;
  data: string;
  scaled_from?: { width: number; height: number };
}

// Holds no OHZI singletons: the consumer injects the graphics surface and a
// camera predicate, so this stays testable without a WebGPU context.
class CaptureService
{
  private graphics: CaptureGraphics;
  private has_camera: () => boolean;
  private create_canvas: () => ScratchCanvas;

  constructor(
    graphics: CaptureGraphics,
    has_camera: () => boolean,
    create_canvas: () => ScratchCanvas = () => document.createElement('canvas') as unknown as ScratchCanvas
  )
  {
    this.graphics = graphics;
    this.has_camera = has_camera;
    this.create_canvas = create_canvas;
  }

  async capture(options: CaptureOptions): Promise<CaptureResult>
  {
    if (options.mode === 'hires')
    {
      return this.capture_hires(options);
    }

    return this.capture_fast(options);
  }

  // Reads the live canvas. Valid because the renderer is created with
  // preserveDrawingBuffer: true, so the backbuffer still holds the last frame.
  private async capture_fast(options: CaptureOptions): Promise<CaptureResult>
  {
    const canvas = this.graphics.canvas;
    const target = this.scaled_size(canvas.width, canvas.height, options.max_size);

    if (target !== null)
    {
      const scratch = this.draw_scaled(canvas, target.width, target.height);

      if (scratch !== null)
      {
        const scaled_blob = await this.request_blob((callback) => scratch.toBlob(callback, 'image/png'));
        const scaled = await this.build_result('fast', target.width, target.height, scaled_blob);

        scaled.scaled_from = { width: canvas.width, height: canvas.height };

        return scaled;
      }
    }

    const blob = await this.request_blob((callback) => canvas.toBlob(callback, 'image/png'));

    return this.build_result('fast', canvas.width, canvas.height, blob);
  }

  // Returns null when no downscale should happen: an explicit opt-out, or a
  // canvas already within the cap. Never upscales.
  private scaled_size(width: number, height: number, max_size: unknown): { width: number; height: number } | null
  {
    const cap = typeof max_size === 'number' ? max_size : DEFAULT_MAX_FAST_SIZE;

    if (!Number.isFinite(cap) || cap <= 0)
    {
      return null;
    }

    const long_edge = Math.max(width, height);

    if (long_edge <= cap)
    {
      return null;
    }

    const ratio = cap / long_edge;

    return {
      width: Math.max(1, Math.round(width * ratio)),
      height: Math.max(1, Math.round(height * ratio))
    };
  }

  // Returns null if no 2D context is available, in which case the caller falls
  // back to a native capture. A large image beats no image.
  private draw_scaled(source: unknown, width: number, height: number): ScratchCanvas | null
  {
    const scratch = this.create_canvas();

    scratch.width = width;
    scratch.height = height;

    const context = scratch.getContext('2d');

    if (context === null)
    {
      return null;
    }

    context.drawImage(source, 0, 0, width, height);

    return scratch;
  }

  private async capture_hires(options: CaptureOptions): Promise<CaptureResult>
  {
    // Graphics.take_screenshot dereferences CameraManager.current directly and
    // would throw a TypeError, so refuse with a code the caller can act on.
    if (!this.has_camera())
    {
      throw this.error('no_camera', 'A hires capture needs an active camera; CameraManager.current is not set yet.');
    }

    const canvas = this.graphics.canvas;
    const width = this.dimension(options.width, canvas.width);
    const height = this.dimension(options.height, canvas.height);

    const blob = await this.request_blob((callback) => this.graphics.take_screenshot(callback, width, height));

    return this.build_result('hires', width, height, blob);
  }

  private dimension(value: unknown, fallback: number): number
  {
    if (typeof value === 'number')
    {
      return this.clamp(value);
    }

    return this.clamp(fallback);
  }

  // take_screenshot renders ceil(w/1024) * ceil(h/1024) tiles, so an unbounded
  // size would stall the frame for a very long time.
  private clamp(value: number): number
  {
    if (!Number.isFinite(value) || value < 1)
    {
      return 1;
    }

    return Math.min(Math.floor(value), MAX_DIMENSION);
  }

  private request_blob(request: (callback: (blob: Blob | null) => void) => void): Promise<Blob>
  {
    return new Promise((resolve, reject) =>
    {
      request((blob) =>
      {
        if (blob === null)
        {
          reject(this.error('capture_failed', 'The canvas produced no image data.'));
          return;
        }

        resolve(blob);
      });
    });
  }

  private async build_result(mode: 'fast' | 'hires', width: number, height: number, blob: Blob): Promise<CaptureResult>
  {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    return {
      mode,
      // Graphics asks toBlob for the malformed type 'image/png;base64;', which
      // browsers fall back to PNG for. Report what the bytes actually are.
      mime_type: 'image/png',
      width,
      height,
      bytes: bytes.length,
      data: this.to_base64(bytes)
    };
  }

  private to_base64(bytes: Uint8Array): string
  {
    let binary = '';

    // Chunked: spreading a full-resolution capture into String.fromCharCode
    // overflows the call stack.
    for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE)
    {
      binary += String.fromCharCode(...bytes.subarray(i, i + BASE64_CHUNK_SIZE));
    }

    return btoa(binary);
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { CaptureService };
