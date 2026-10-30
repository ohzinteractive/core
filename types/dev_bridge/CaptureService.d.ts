export interface CaptureCanvas {
    width: number;
    height: number;
    toBlob(callback: (blob: Blob | null) => void, type?: string): void;
}
export interface ScratchContext {
    drawImage(source: unknown, x: number, y: number, width: number, height: number): void;
}
export interface ScratchCanvas {
    width: number;
    height: number;
    getContext(type: '2d'): ScratchContext | null;
    toBlob(callback: (blob: Blob | null) => void, type?: string): void;
}
export interface CaptureGraphics {
    canvas: CaptureCanvas;
    take_screenshot(callback: (blob: Blob | null) => void, width?: number, height?: number): void;
}
export interface CaptureOptions {
    mode?: unknown;
    width?: unknown;
    height?: unknown;
    max_size?: unknown;
}
export interface CaptureResult {
    mode: 'fast' | 'hires';
    mime_type: string;
    width: number;
    height: number;
    bytes: number;
    data: string;
    scaled_from?: {
        width: number;
        height: number;
    };
}
declare class CaptureService {
    private graphics;
    private has_camera;
    private create_canvas;
    constructor(graphics: CaptureGraphics, has_camera: () => boolean, create_canvas?: () => ScratchCanvas);
    capture(options: CaptureOptions): Promise<CaptureResult>;
    private capture_fast;
    private scaled_size;
    private draw_scaled;
    private capture_hires;
    private dimension;
    private clamp;
    private request_blob;
    private build_result;
    private to_base64;
    private error;
}
export { CaptureService };
