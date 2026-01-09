import { Quaternion, Vector3 } from 'three';

class ObjectOrientedBoundingBox
{
  axis_to_world: any;
  bounds: any;
  center: any;
  max: any;
  min: any;
  world_to_axis: any;
  /**
   * @param {Vector3[]} points
   */
  constructor(points: any)
  {
    let degrees = 0;
    const center = this.get_center(points);
    // console.log(points);

    let min = new Vector3(90000, 90000, 90000);
    let max = new Vector3(-90000, -90000, -90000);

    for (let deg = 0; deg < 359; deg++)
    {
      const local_min = new Vector3(100000, 100000, 100000);
      const local_max = new Vector3(-100000, -100000, -100000);

      for (let i = 0; i < points.length; i++)
      {
        const store_pos = points[i].clone();
        // store_pos.set(points[i].x, points[i].z, points[i].y);

        store_pos.sub(center);

        const quaternion = new Quaternion();

        quaternion.setFromAxisAngle(new Vector3(0, 1, 0), (deg / 359) * Math.PI * 2);

        store_pos.applyQuaternion(quaternion);

        if (store_pos.x < local_min.x)
        {
          local_min.x = store_pos.x;
        }
        if (store_pos.y < local_min.y)
        {
          local_min.y = store_pos.y;
        }
        if (store_pos.z < local_min.z)
        {
          local_min.z = store_pos.z;
        }

        if (store_pos.x > local_max.x)
        {
          local_max.x = store_pos.x;
        }
        if (store_pos.y > local_max.y)
        {
          local_max.y = store_pos.y;
        }
        if (store_pos.z > local_max.z)
        {
          local_max.z = store_pos.z;
        }
      }
      if (this.box_volume(local_min, local_max) < this.box_volume(min, max))
      {
        max = local_max;
        min = local_min;
        degrees = deg;
      }
    }

    this.axis_to_world = new Quaternion().setFromAxisAngle(new Vector3(0, -1, 0), (degrees / 359) * Math.PI * 2);
    this.world_to_axis = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0),  (degrees / 359) * Math.PI * 2);

    this.min = min.clone();
    this.max = max.clone();
    this.center = center;

    const left_down   = min;
    // let left_up     = min.clone().add(new Vector3(0, max.y - min.y, 0));
    // let right_up    = max;
    const right_down  = min.clone().add(new Vector3(max.x - min.x, 0, 0));

    const deep_left   = min.clone().add(new Vector3(0, 0, max.z - min.z));
    const deep_right  = min.clone().add(new Vector3(max.x - min.x, 0, max.z - min.z));

    this.bounds = [];
    this.bounds[0] = left_down.clone();
    this.bounds[1] = right_down.clone();
    this.bounds[2] = deep_right.clone();
    this.bounds[3] = deep_left.clone();
    this.bounds[4] = left_down.clone();
    // ######################################

    // DEBUG
    // left_down.applyQuaternion(this.axis_to_world);
    //   left_up.applyQuaternion(this.axis_to_world);
    //   right_up.applyQuaternion(this.axis_to_world);
    //   right_down.applyQuaternion(this.axis_to_world);

    //   deep_left.applyQuaternion(this.axis_to_world);
    //   deep_right.applyQuaternion(this.axis_to_world);

    // Debug.draw_line(center.clone().add(left_down),center.clone().add(right_down));
    //   Debug.draw_line(center.clone().add(left_down),center.clone().add(left_up));
    //   Debug.draw_line(center.clone().add(left_down),center.clone().add(deep_left));
    //   Debug.draw_line(center.clone().add(right_down),center.clone().add(deep_right));
    //   Debug.draw_line(center.clone().add(deep_left),center.clone().add(deep_right));
  }

  /**
   * @param {Vector3[]} points
   */
  get_center(points: any)
  {
    const v = new Vector3();
    for (let i = 0; i < points.length; i++)
    {
      v.add(points[i]);
    }
    v.multiplyScalar(1 / points.length);
    return v;
  }

  /**
   * @param {Vector3} min
   * @param {Vector3} max
   */
  box_volume(min: any, max: any)
  {
    const difference = max.clone().sub(min);
    return Math.abs(difference.x * difference.y * difference.x);
  }

  getSize()
  {
    return this.max.clone().sub(this.min);
  }

  /**
   * @param {Vector3} point
   */
  is_inside_XZ(point: any)
  {
    const pos = point.clone();
    pos.sub(this.center);
    pos.applyQuaternion(this.world_to_axis);
    if (pos.x > this.min.x &&
        pos.z > this.min.z &&
        pos.x < this.max.x &&
        pos.z < this.max.z)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  /**
   * @param {Vector3} reference_point
   */
  closest_point_on_bounds(reference_point: any)
  {
    const force = new Vector3();
    for (let i = 0; i < this.bounds.length - 1; i++)
    {
      let dir = this.bounds[i + 1].clone().sub(this.bounds[i]);
      dir.y = 0;
      dir.normalize();
      dir = new Vector3(dir.z, 0, -dir.x);

      const dir_to_point = this.world_to_local(reference_point);
      dir_to_point.sub(this.bounds[i]);
      dir_to_point.y = 0;

      if (dir_to_point.clone().normalize().dot(dir) > 0)
      {
        const dot = dir_to_point.clone().dot(dir);
        force.add(dir.multiplyScalar(dot));
      }
    }
    return this.local_to_world_dir(force);
  }

  /**
   * @param {Vector3} point
   */
  world_to_local(point: any)
  {
    const pos = point.clone().sub(this.center);
    pos.applyQuaternion(this.world_to_axis);
    return pos;
  }

  /**
   * @param {Vector3} point
   */
  local_to_world(point: any)
  {
    const pos = point.clone();
    pos.applyQuaternion(this.axis_to_world);
    pos.add(this.center);
    return pos;
  }

  /**
   * @param {Vector3} direction
   */
  local_to_world_dir(direction: any)
  {
    const dir = direction.clone();
    dir.applyQuaternion(this.axis_to_world);
    return dir;
  }

  get_corners()
  {
    const corners = [];
    for (let i = 0; i < this.bounds.length; i++)
    {
      corners.push(this.local_to_world(this.bounds[i]));
    }
    return corners;
  }
}

export { ObjectOrientedBoundingBox };
