import * as THREE from 'three';

export default class ImageUtilities
{
  constructor()
  { }

  static get_image_data(image)
  {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
  }

  static get_pixel(imagedata, x, y)
  {
    let position = (x + imagedata.width * y) * 4;
    let data = imagedata.data;
    return new THREE.Vector4(data[position + 0], data[position + 1], data[position + 2], data[position + 3]);
  }
}
