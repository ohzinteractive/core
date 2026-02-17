import { Line3, Plane, Quaternion, Sphere, Vector3 } from 'three';
import { OMath } from './OMath';

class PerspectiveFrustumPointFitter
{
  sphere: Sphere;
  
  constructor()
  {
    this.sphere = new Sphere();
  }

  fit_points(points: Vector3[], camera_quaternion: Quaternion, vertical_fov: number, aspect: number)
  {
    this.sphere.setFromPoints(points);

    const v_fov = OMath.degToRad(vertical_fov / 2);
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * aspect)) / 2;

    const up_plane_normal = this.get_up_plane_normal(camera_quaternion, v_fov);
    const down_plane_normal = this.get_down_plane_normal(camera_quaternion, v_fov);
    const left_plane_normal = this.get_left_plane_normal(camera_quaternion, h_fov);
    const right_plane_normal = this.get_right_plane_normal(camera_quaternion, h_fov);

    const camera_forward_dir = new Vector3(0, 0, -1).applyQuaternion(camera_quaternion);

    const sphere_center = this.sphere.center.clone();

    const pull_back_distance = this.get_distance_to_fit_rect(this.sphere.radius * 2, this.sphere.radius * 2, vertical_fov, aspect);
    const far_pos = sphere_center.clone().add(camera_forward_dir.clone().multiplyScalar(pull_back_distance * -1));

    const up_plane    = new Plane().setFromNormalAndCoplanarPoint(up_plane_normal, far_pos);
    const down_plane  = new Plane().setFromNormalAndCoplanarPoint(down_plane_normal, far_pos);

    const left_plane   = new Plane().setFromNormalAndCoplanarPoint(left_plane_normal, far_pos);
    const right_plane  = new Plane().setFromNormalAndCoplanarPoint(right_plane_normal, far_pos);

    this.apply_center_correction_to_pos(far_pos, points, camera_quaternion, up_plane, down_plane, left_plane, right_plane);

    up_plane.setFromNormalAndCoplanarPoint(up_plane_normal, far_pos);
    down_plane.setFromNormalAndCoplanarPoint(down_plane_normal, far_pos);

    left_plane.setFromNormalAndCoplanarPoint(left_plane_normal, far_pos);
    right_plane.setFromNormalAndCoplanarPoint(right_plane_normal, far_pos);

    let closest_distance = Infinity;

    const inverse_dir = camera_forward_dir.clone().multiplyScalar(pull_back_distance * -2);
    for (let i = 0; i < points.length; i++)
    {
      const line = new Line3(points[i].clone(), points[i].clone().add(inverse_dir));

      const up_line_intersection  = new Vector3();
      const down_line_intersection = new Vector3();

      const left_line_intersection  = new Vector3();
      const right_line_intersection = new Vector3();

      up_plane.intersectLine(line,  up_line_intersection);
      down_plane.intersectLine(line, down_line_intersection);

      left_plane.intersectLine(line,  left_line_intersection);
      right_plane.intersectLine(line, right_line_intersection);

      if (up_line_intersection.length() < 0.0001)
      {
        console.log('up intersection not found', i);
      }
      if (down_line_intersection.length() < 0.0001)
      {
        console.log('down intersection not found', i);
      }
      if (left_line_intersection.length() < 0.0001)
      {
        console.log('left intersection not found', i);
      }
      if (right_line_intersection.length() < 0.0001)
      {
        console.log('right intersection not found', i);
      }

      const new_up_distance   = points[i].clone().sub(up_line_intersection).length();
      const new_down_distance = points[i].clone().sub(down_line_intersection).length();

      const new_left_distance   = points[i].clone().sub(left_line_intersection).length();
      const new_right_distance  = points[i].clone().sub(right_line_intersection).length();

      const vertical_min    = Math.min(new_up_distance, new_down_distance);
      const horizontal_min  = Math.min(new_left_distance, new_right_distance);

      const min = Math.min(vertical_min, horizontal_min);

      if (min < closest_distance)
      {
        closest_distance = min;
      }
    }

    const forward_correction = camera_forward_dir.clone().multiplyScalar(closest_distance);
    const closest_position = far_pos.clone().add(forward_correction);

    return closest_position;
  }

  apply_center_correction_to_pos(target_pos: Vector3, points: Vector3[], camera_quaternion: Quaternion, up_plane: Plane, down_plane: Plane, left_plane: Plane, right_plane: Plane)
  {
    const vertical_offset = this.get_vertical_correction(points, down_plane, up_plane, camera_quaternion);
    const horizontal_offset = this.get_horizontal_correction(points, left_plane, right_plane, camera_quaternion);

    target_pos.add(vertical_offset);
    target_pos.add(horizontal_offset);
  }

  get_vertical_correction(points: Vector3[], down_plane: Plane, up_plane: Plane, camera_quaternion: Quaternion)
  {
    let closest_distance_to_up_plane = Infinity;
    let closest_distance_to_down_plane  = Infinity;
    // let closest_up_point = undefined;
    // let closest_down_point = undefined;

    const up_dir = new Vector3(0, 1, 0).applyQuaternion(camera_quaternion);
    for (let i = 0; i < points.length; i++)
    {
      const down_line   = new Line3(points[i].clone(), points[i].clone().add(up_dir.clone().multiplyScalar(-5000000)));
      const up_line     = new Line3(points[i].clone(), points[i].clone().add(up_dir.clone().multiplyScalar(5000000)));

      const down_line_intersection  = new Vector3();
      const up_line_intersection = new Vector3();

      down_plane.intersectLine(down_line,  down_line_intersection);
      up_plane.intersectLine(up_line, up_line_intersection);

      const down_dist   = down_line_intersection.distanceTo(points[i]);
      const up_dist     = up_line_intersection.distanceTo(points[i]);

      if (up_line_intersection.length() < 0.0001)
      {
        console.log('vertical up intersection not found', i);
      }
      if (down_line_intersection.length() < 0.0001)
      {
        console.log('vertical down intersection not found', i);
      }

      if (down_dist < closest_distance_to_down_plane)
      {
        closest_distance_to_down_plane = down_dist;
        // closest_down_point = points[i];
      }
      if (up_dist < closest_distance_to_up_plane)
      {
        closest_distance_to_up_plane = up_dist;
        // closest_up_point = points[i];
      }
    }

    const correction = (closest_distance_to_up_plane - closest_distance_to_down_plane) / 2;

    // console.log("vertical_correction", correction)
    return up_dir.clone().multiplyScalar(-correction);
  }

  get_horizontal_correction(points: Vector3[], left_plane: Plane, right_plane: Plane, camera_quaternion: Quaternion)
  {
    let closest_distance_to_right_plane = Infinity;
    let closest_distance_to_left_plane  = Infinity;
    // let closest_right_point = undefined;
    // let closest_left_point = undefined;

    const right_dir = new Vector3(1, 0, 0).applyQuaternion(camera_quaternion);

    for (let i = 0; i < points.length; i++)
    {
      const left_line  = new Line3(points[i].clone(), points[i].clone().add(right_dir.clone().multiplyScalar(-5000000)));
      const right_line = new Line3(points[i].clone(), points[i].clone().add(right_dir.clone().multiplyScalar(5000000)));

      const left_line_intersection  = new Vector3();
      const right_line_intersection = new Vector3();

      left_plane.intersectLine(left_line,  left_line_intersection);
      right_plane.intersectLine(right_line, right_line_intersection);

      const left_dist  = left_line_intersection.distanceTo(points[i]);
      const right_dist = right_line_intersection.distanceTo(points[i]);

      if (left_line_intersection.length() < 0.0001)
      {
        console.log('left intersection not found', i);
      }
      if (right_line_intersection.length() < 0.0001)
      {
        console.log('right intersection not found', i);
      }

      if (left_dist < closest_distance_to_left_plane)
      {
        closest_distance_to_left_plane = left_dist;
        // closest_left_point = points[i];
      }
      if (right_dist < closest_distance_to_right_plane)
      {
        closest_distance_to_right_plane = right_dist;
        // closest_right_point = points[i];
      }
    }

    const correction = (closest_distance_to_right_plane - closest_distance_to_left_plane) / 2;
    // console.log("horizontal_correction", correction)

    return right_dir.clone().multiplyScalar(-correction);
  }

  get_up_plane_normal(camera_quaternion: Quaternion, v_fov: number)
  {
    const up_plane_normal = new Vector3(0, -1, 0);
    up_plane_normal.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), v_fov));
    up_plane_normal.applyQuaternion(camera_quaternion);
    return up_plane_normal;
  }

  get_down_plane_normal(camera_quaternion: Quaternion, v_fov: number)
  {
    const down_plane_normal = new Vector3(0, 1, 0);
    down_plane_normal.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -v_fov));
    down_plane_normal.applyQuaternion(camera_quaternion);
    return down_plane_normal;
  }

  get_left_plane_normal(camera_quaternion: Quaternion, h_fov: number)
  {
    const left_plane_normal = new Vector3(1, 0, 0);
    left_plane_normal.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), h_fov));
    left_plane_normal.applyQuaternion(camera_quaternion);
    return left_plane_normal;
  }

  get_right_plane_normal(camera_quaternion: Quaternion, h_fov: number)
  {
    const right_plane_normal = new Vector3(-1, 0, 0);
    right_plane_normal.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -h_fov));
    right_plane_normal.applyQuaternion(camera_quaternion);
    return right_plane_normal;
  }

  get_distance_to_fit_rect(width: number, height: number, vertical_fov: number, aspect: number)
  {
    const v_fov = (vertical_fov / 2) * Math.PI / 180;
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * aspect)) / 2;

    const distV = height / Math.tan(v_fov);
    const distH = width / Math.tan(h_fov);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }
}

export { PerspectiveFrustumPointFitter };
