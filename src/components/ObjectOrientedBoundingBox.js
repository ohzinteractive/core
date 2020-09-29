
import { Vector3 } from 'three';
import { Quaternion } from 'three';

export default class ObjectOrientedBoundingBox
{
  constructor(points)
  {
    let degrees = 0;
    let center = this.get_center(points);
    // console.log(points);

    let min = new Vector3(90000, 90000, 90000);
    let max = new Vector3(-90000, -90000, -90000);

    for (let deg = 0; deg < 359; deg++)
    {
      let local_min = new Vector3(100000, 100000, 100000);
      let local_max = new Vector3(-100000, -100000, -100000);

      for (let i = 0; i < points.length; i++)
      {
        let store_pos = points[i].clone();
        // store_pos.set(points[i].x, points[i].z, points[i].y);

        store_pos.sub(center);

        let quaternion = new Quaternion();

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

    let left_down   = min;
    let left_up     = min.clone().add(new Vector3(0, max.y - min.y, 0));
    let right_up    = max;
    let right_down  = min.clone().add(new Vector3(max.x - min.x, 0, 0));

    let deep_left   = min.clone().add(new Vector3(0, 0, max.z - min.z));
    let deep_right  = min.clone().add(new Vector3(max.x - min.x, 0, max.z - min.z));

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

  get_center(points)
  {
    let v = new Vector3();
    for (let i = 0; i < points.length; i++)
    {
      v.add(points[i]);
    }
    v.multiplyScalar(1 / points.length);
    return v;
  }

  box_volume(min, max)
  {
    let difference = max.clone().sub(min);
    return Math.abs(difference.x * difference.y * difference.x);
  }

  getSize()
  {
    return this.max.clone().sub(this.min);
  }

  is_inside_XZ(point)
  {
    let pos = point.clone();
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

  closest_point_on_bounds(reference_point)
  {
    let force = new Vector3();
    for (let i = 0; i < this.bounds.length - 1; i++)
    {
      let dir = this.bounds[i + 1].clone().sub(this.bounds[i]);
      dir.y = 0;
      dir.normalize();
      dir = new Vector3(dir.z, 0, -dir.x);

      let dir_to_point = this.world_to_local(reference_point);
      dir_to_point.sub(this.bounds[i]);
      dir_to_point.y = 0;

      if (dir_to_point.clone().normalize().dot(dir) > 0)
      {
        let dot = dir_to_point.clone().dot(dir);
        force.add(dir.multiplyScalar(dot));
      }
    }
    return this.local_to_world_dir(force);
  }

  world_to_local(point)
  {
    let pos = point.clone().sub(this.center);
    pos.applyQuaternion(this.world_to_axis);
    return pos;
  }

  local_to_world(point)
  {
    let pos = point.clone();
    pos.applyQuaternion(this.axis_to_world);
    pos.add(this.center);
    return pos;
  }

  local_to_world_dir(direction)
  {
    let dir = direction.clone();
    dir.applyQuaternion(this.axis_to_world);
    return dir;
  }

  get_corners()
  {
    let corners = [];
    for (let i = 0; i < this.bounds.length; i++)
    {
      corners.push(this.local_to_world(this.bounds[i]));
    }
    return corners;
  }
}
