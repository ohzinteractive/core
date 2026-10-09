import type { Quaternion } from 'three';
import { Box3, Vector3 } from 'three';

class OrthographicFrustumPointFitter
{
  constructor()
  {

  }

  fit_points(points: Vector3[], camera_quaternion: Quaternion, vertical_fov: number, aspect: number)
  {
    const bounds = this.get_view_bounds(points, camera_quaternion);

    const distance = this.get_distance_to_fit_rect(bounds.size.x / 2, bounds.size.y / 2, vertical_fov, aspect);

    return {
      center: bounds.center,
      distance_to_center: distance
    };
  }

  // Bounds of the points as seen by a camera with this rotation: the center in
  // world space, and the size along the camera right (x), up (y) and view (z) axes.
  get_view_bounds(points: Vector3[], camera_quaternion: Quaternion)
  {
    const inverse_camera_quat = camera_quaternion.clone().invert();

    const inverted_points = [];

    for (let i = 0; i < points.length; i++)
    {
      inverted_points.push(points[i].clone().applyQuaternion(inverse_camera_quat));
    }

    const box = new Box3().setFromPoints(inverted_points);
    const size = new Vector3();
    box.getSize(size);

    const center = new Vector3();
    box.getCenter(center);

    center.applyQuaternion(camera_quaternion);

    return {
      center: center,
      size: size
    };
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

export { OrthographicFrustumPointFitter };
