import * as THREE from 'three';

export default class HorizontalPlane extends THREE.Mesh
{
  constructor(width, height, color, material)
  {
    width = width || 1;
    height = height || 1;
    color = color || '#FF0000';
    material = material || new THREE.MeshBasicMaterial({ color: color });

    let geometry = new THREE.PlaneBufferGeometry(width, height);
    geometry.rotateX(-3.14 / 2);
    super(geometry, material);
  }
}
