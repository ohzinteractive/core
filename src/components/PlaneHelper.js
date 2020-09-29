
import { Object3D } from 'three';
import { MeshBasicMaterial } from 'three';
import { PlaneGeometry } from 'three';
import { Mesh } from 'three';

export default class PlaneHelper extends Object3D
{
  constructor(scale = 1.0)
  {
    super();

    const lineMat = new MeshBasicMaterial({ color: 0x4444ff, wireframe: true });
    const geo = new PlaneGeometry(1, 1, 1, 1);
    geo.rotateX(-Math.PI * 0.5);

    const line = new Mesh(geo, lineMat);

    const meshMat = new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
    const mesh = new Mesh(geo, meshMat);

    this.renderOrder = 100000;
    this.add(line);
    this.add(mesh);
    this.scale.set(scale, scale, scale);
  }

  update()
  {
  }

  dispose()
  {

  }
}
