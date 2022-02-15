import { Vector3, Box3 } from 'three';

export default class OrthographicFrustumPointFitter
{
  constructor()
  {

  }

  fit_points(points, camera_quaternion, vertical_fov, aspect)
  {
    const inverse_camera_quat = camera_quaternion.clone().inverse();

    const inverted_points = [];

    for (let i = 0; i < points.length; i++)
    {
      inverted_points.push(points[i].clone().applyQuaternion(inverse_camera_quat));
    }

    const box = new Box3().setFromPoints(inverted_points);
    const size = new Vector3();
    box.getSize(size);

    const distance = this.get_distance_to_fit_rect(size.x / 2, size.y / 2, vertical_fov, aspect);

    const center = new Vector3();
    box.getCenter(center);

    center.applyQuaternion(camera_quaternion);

    return {
      center: center,
      distance_to_center: distance
    };
  }

  get_distance_to_fit_rect(width, height, vertical_fov, aspect)
  {
    const v_fov = (vertical_fov / 2) * Math.PI / 180;
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * aspect)) / 2;

    const distV = height / Math.tan(v_fov);
    const distH = width / Math.tan(h_fov);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }
}
