import { Vector3 } from 'three';

export default class CustomBezierCurve
{
  constructor(points)
  {
    this.original_points = [];
    this.tmp_points = [];
    for (let i = 0; i < points.length; i++)
    {
      this.original_points.push(new Vector3().copy(points[i]));
      this.tmp_points.push(new Vector3());
    }
  }

  build(point_amount)
  {
    let curve = [];
    for (let i = 0; i < point_amount; i++)
    {
      curve.push(new Vector3().copy(this.get_point_at(i / point_amount)));
    }
    return curve;
  }

  get_point_at(t)
  {
    for (let i = 0; i < this.original_points.length; i++)
    {
      this.tmp_points[i].copy(this.original_points[i]);
    }

    let tmp_vec = new Vector3();
    for (let steps = this.tmp_points.length - 1; steps > 0; steps--)
    {
      for (let i = 0; i < steps; i++)
      {
        tmp_vec.lerpVectors(this.tmp_points[i], this.tmp_points[i + 1], t);
        this.tmp_points[i].copy(tmp_vec);
      }
    }
    return this.tmp_points[0].clone();
  }
}
