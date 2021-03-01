import { Vector3, Plane, Quaternion, Box3 } from 'three';

export default class OrthographicFrustumPointFitter
{
  constructor()
  {

  }

  fit_points(points, camera_quaternion, vertical_fov, aspect)
  {
    let inverse_camera_quat = camera_quaternion.clone().inverse();

    let inverted_points = [];

    for (let i = 0; i < points.length; i++)
    {
      inverted_points.push(points[i].clone().applyQuaternion(inverse_camera_quat));
    }

    let box = new Box3().setFromPoints(inverted_points);
    let size = new Vector3();
    box.getSize(size);

    let distance = this.get_distance_to_fit_rect(size.x / 2, size.y / 2, vertical_fov, aspect);

    let center = new Vector3();
    box.getCenter(center);

    center.applyQuaternion(camera_quaternion);

    return {
      center: center,
      distance_to_center: distance
    };
  }

  get_distance_to_fit_rect(width, height, vertical_fov, aspect)
  {
    let v_fov = (vertical_fov / 2) * Math.PI / 180;
    let h_fov = (2 * Math.atan(Math.tan(v_fov) * aspect)) / 2;

    let distV = height / Math.tan(v_fov);
    let distH = width / Math.tan(h_fov);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }
}
