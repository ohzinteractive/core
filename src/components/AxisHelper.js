
import { Object3D } from 'three';
import { LineBasicMaterial } from 'three';
import { AlwaysDepth } from 'three';
import { BufferGeometry } from 'three';
import { Vector3 } from 'three';
import { Line } from 'three';

class AxisHelper extends Object3D
{
  constructor(scale = 1.0)
  {
    super();

    const blue_points = [];
    blue_points.push(new Vector3(0, 0, 0));
    blue_points.push(new Vector3(0, 0, 1000));

    const blue_axis_mat = new LineBasicMaterial({ color: 0x4444ff, depthFunc: AlwaysDepth });
    const blue_axis_geo = new BufferGeometry().setFromPoints(blue_points);
    const blue_axis_line = new Line(blue_axis_geo, blue_axis_mat);
    blue_axis_line.renderOrder = 50000;

    const green_points = [];
    green_points.push(new Vector3(0, 0, 0));
    green_points.push(new Vector3(0, 1000, 0));

    const green_axis_mat = new LineBasicMaterial({ color: 0x44ff44, depthFunc: AlwaysDepth });
    const green_axis_geo = new BufferGeometry().setFromPoints(green_points);
    const green_axis_line = new Line(green_axis_geo, green_axis_mat);
    green_axis_line.renderOrder = 50000;

    const red_points = [];
    red_points.push(new Vector3(0, 0, 0));
    red_points.push(new Vector3(1000, 0, 0));

    const red_axis_mat = new LineBasicMaterial({ color: 0xff4444, depthFunc: AlwaysDepth });
    const red_axis_geo = new BufferGeometry().setFromPoints(red_points);
    const red_axis_line = new Line(red_axis_geo, red_axis_mat);
    red_axis_line.renderOrder = 50000;

    this.renderOrder = 100000;

    this.add(blue_axis_line);
    this.add(green_axis_line);
    this.add(red_axis_line);

    this.scale.set(scale, scale, scale);
  }

  update()
  {
  }

  dispose()
  {
  }
}

export { AxisHelper };
