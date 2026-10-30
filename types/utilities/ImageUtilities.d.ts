import { Vector4 } from 'three';
declare class ImageUtilities {
    constructor();
    static get_image_data(image: ImageBitmap): ImageData;
    static get_pixel(imagedata: ImageData, x: number, y: number): Vector4;
}
export { ImageUtilities };
