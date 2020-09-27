
import * as THREE from 'three';

export default class PlaneHelper extends THREE.Object3D
{
  constructor(scale = 1.0)
  {
    super();

    const lineMat = new THREE.MeshBasicMaterial({ color: 0x4444ff, wireframe: true });
    const geo = new THREE.PlaneGeometry(1, 1, 1, 1);
    geo.rotateX(-Math.PI * 0.5);

    const line = new THREE.Mesh(geo, lineMat);

    const meshMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geo, meshMat);

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
