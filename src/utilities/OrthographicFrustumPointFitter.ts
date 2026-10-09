import type { OrthographicCamera, Quaternion } from 'three';
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

    // Points lined up along an axis leave rounding noise, not 0, across it.
    const epsilon = 1e-9 * Math.max(size.x, size.y, size.z);
    size.set(
      size.x > epsilon ? size.x : 0,
      size.y > epsilon ? size.y : 0,
      size.z > epsilon ? size.z : 0
    );

    const center = new Vector3();
    box.getCenter(center);

    center.applyQuaternion(camera_quaternion);

    return {
      center: center,
      size: size
    };
  }

  // The camera zoom that shows a width x height area through the camera
  // frustum, times scale. A degenerate area keeps the current zoom, unscaled.
  get_zoom_to_fit_size(camera: OrthographicCamera, width: number, height: number, scale = 1)
  {
    const zoom = Math.min(
      Math.abs((camera.right - camera.left) / width),
      Math.abs((camera.top - camera.bottom) / height)
    );

    return Number.isFinite(zoom) ? zoom * scale : camera.zoom;
  }

  // An orthographic camera frames through its zoom, so its distance to the
  // center only has to keep a depth of +-half_depth between the near and far
  // planes. The preferred distance is kept when it does; if nothing does, the
  // near plane wins.
  get_distance_to_fit_depth(camera: OrthographicCamera, half_depth: number, preferred_distance: number)
  {
    const closest = half_depth + camera.near;
    const farthest = camera.far - half_depth;

    let distance = Math.max(preferred_distance, closest);
    if (distance > farthest)
    {
      distance = Math.max(closest, farthest);
    }
    return distance;
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
