
export default class AxisHelper extends THREE.Object3D {
  constructor(scale = 1.0) {
    super();

    const blueAxisMat = new THREE.LineBasicMaterial({ color: 0x4444ff, depthFunc: THREE.AlwaysDepth });
    const blueAxisGeo = new THREE.Geometry();
    blueAxisGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    blueAxisGeo.vertices.push(new THREE.Vector3(0, 0, 1000));
    const blueAxisLine = new THREE.Line(blueAxisGeo, blueAxisMat);
    blueAxisLine.renderOrder = 50000;

    const greenAxisMat = new THREE.LineBasicMaterial({ color: 0x44ff44, depthFunc: THREE.AlwaysDepth });
    const greenAxisGeo = new THREE.Geometry();
    greenAxisGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    greenAxisGeo.vertices.push(new THREE.Vector3(0, 1000, 0));
    const greenAxisLine = new THREE.Line(greenAxisGeo, greenAxisMat);
    greenAxisLine.renderOrder = 50000;

    const redAxisMat = new THREE.LineBasicMaterial({ linewidth: 100, color: 0xff4444, depthFunc: THREE.AlwaysDepth });
    const redAxisGeo = new THREE.Geometry();
    redAxisGeo.computeLineDistances();
    redAxisGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    redAxisGeo.vertices.push(new THREE.Vector3(1000, 0, 0));
    const redAxisLine = new THREE.Line(redAxisGeo, redAxisMat);
    redAxisLine.renderOrder = 50000;
    this.renderOrder = 100000;
    this.add(blueAxisLine);
    this.add(greenAxisLine);
    this.add(redAxisLine);
    this.scale.set(scale, scale, scale);
 
  }

  update() {
  }

  dispose() {

  }
}
