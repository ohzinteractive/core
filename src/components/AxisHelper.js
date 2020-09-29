
import { Object3D } from 'three';
import { LineBasicMaterial } from 'three';
import { AlwaysDepth } from 'three';
import { Geometry } from 'three';
import { Vector3 } from 'three';
import { Line } from 'three';

export default class AxisHelper extends Object3D
{
  constructor(scale = 1.0)
  {
    super();

    const blueAxisMat = new LineBasicMaterial({ color: 0x4444ff, depthFunc: AlwaysDepth });
    const blueAxisGeo = new Geometry();
    blueAxisGeo.vertices.push(new Vector3(0, 0, 0));
    blueAxisGeo.vertices.push(new Vector3(0, 0, 1000));
    const blueAxisLine = new Line(blueAxisGeo, blueAxisMat);
    blueAxisLine.renderOrder = 50000;

    const greenAxisMat = new LineBasicMaterial({ color: 0x44ff44, depthFunc: AlwaysDepth });
    const greenAxisGeo = new Geometry();
    greenAxisGeo.vertices.push(new Vector3(0, 0, 0));
    greenAxisGeo.vertices.push(new Vector3(0, 1000, 0));
    const greenAxisLine = new Line(greenAxisGeo, greenAxisMat);
    greenAxisLine.renderOrder = 50000;

    const redAxisMat = new LineBasicMaterial({ linewidth: 100, color: 0xff4444, depthFunc: AlwaysDepth });
    const redAxisGeo = new Geometry();
    redAxisGeo.vertices.push(new Vector3(0, 0, 0));
    redAxisGeo.vertices.push(new Vector3(1000, 0, 0));
    const redAxisLine = new Line(redAxisGeo, redAxisMat);
    redAxisLine.renderOrder = 50000;
    this.renderOrder = 100000;
    this.add(blueAxisLine);
    this.add(greenAxisLine);
    this.add(redAxisLine);
    this.scale.set(scale, scale, scale);
  }

  update()
  {
  }

  dispose()
  {

  }
}
