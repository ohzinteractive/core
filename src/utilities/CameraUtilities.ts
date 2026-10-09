import { CameraManager } from '../CameraManager';
import { OScreen } from '../OScreen';

import type { Camera, Object3D, OrthographicCamera, PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { Box3, Matrix4, Plane, Ray, Vector3 } from 'three';

import type { Input } from '../lib/Input';
import type { Vector2 } from '../lib/Vector2';
import type { PerspectiveCamera } from '../PerspectiveCamera';
import { OrthographicFrustumPointFitter } from './OrthographicFrustumPointFitter';
import { PerspectiveFrustumPointFitter } from './PerspectiveFrustumPointFitter';

class CameraUtilities
{
  input: Input;
  plane: Plane;
  ray: Ray;
  tmp_mat: Matrix4;
  tmp_size: Vector3;
  tmp_unproj: Vector3;

  init(input: Input)
  {
    this.tmp_mat = new Matrix4();
    this.plane = new Plane();
    this.ray = new Ray();

    this.tmp_size = new Vector3();
    this.tmp_unproj = new Vector3();

    this.input = input;
  }

  get_up_dir(camera: Camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.set(0, 1, 0);
    tmp_vec.applyQuaternion(camera.quaternion);

    return tmp_vec;
  }

  get_forward_dir(camera: Camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.set(0, 0, -1);
    tmp_vec.applyQuaternion(camera.quaternion);

    return tmp_vec;
  }

  get_right_dir(camera: Camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.set(1, 0, 0);
    tmp_vec.applyQuaternion(camera.quaternion);
    return tmp_vec;
  }

  unproject_mouse_position(NDC: Vector2, camera: PerspectiveCamera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    const v_fov = (camera.fov / 2) * Math.PI / 180;
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * camera.aspect)) / 2;

    const distV = Math.tan(v_fov) * camera.far;
    const distH = Math.tan(h_fov) * camera.far;

    tmp_vec.set(distH * NDC.x, distV * NDC.y, -camera.far).normalize();

    return tmp_vec.applyQuaternion(camera.quaternion);
  }

  get_plane_intersection(plane_position: Vector3, plane_normal: Vector3, NDC?: Vector2, camera?: Camera)
  {
    camera = camera || CameraManager.current;
    NDC = NDC || this.input.NDC;

    const tmp_vec = new Vector3();

    this.plane.setFromNormalAndCoplanarPoint(plane_normal || this.get_forward_dir(camera), plane_position);
    if ((camera as PerspectiveCamera).isPerspectiveCamera)
    {
      this.ray.set(camera.position, this.unproject_mouse_position(NDC, camera as PerspectiveCamera));
    }
    else
    {
      // The same frustum OrthographicCamera.updateProjectionMatrix() builds.
      const orthographic_camera = camera as OrthographicCamera;
      const center_x = (orthographic_camera.right + orthographic_camera.left) / 2;
      const center_y = (orthographic_camera.top + orthographic_camera.bottom) / 2;
      const half_width = (orthographic_camera.right - orthographic_camera.left) / (2 * orthographic_camera.zoom);
      const half_height = (orthographic_camera.top - orthographic_camera.bottom) / (2 * orthographic_camera.zoom);
      const pos = new Vector3(center_x + NDC.x * half_width, center_y + NDC.y * half_height, 0);
      pos.applyQuaternion(camera.quaternion);
      pos.add(camera.position);
      const dir = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      this.ray.set(pos, dir);
    }
    this.ray.intersectPlane(this.plane, tmp_vec);

    return tmp_vec;
  }

  // Fits the points as the current camera sees them, flattened onto its view
  // plane. zoom_scale scales the area to fit.
  fit_points_on_camera(points: Array<Vector3>, zoom_scale = 1)
  {
    const bounds = new OrthographicFrustumPointFitter().get_view_bounds(points, CameraManager.current.quaternion);
    const size = bounds.size.clone().multiplyScalar(zoom_scale);

    return {
      position: bounds.center,
      zoom: this.get_zoom_to_fit_rect(size.x / 2, size.y / 2)
    };
  }

  // Fits a half width and half height on the current camera. For a
  // perspective camera this is a distance; for an orthographic camera it is
  // the camera zoom.
  get_zoom_to_fit_rect(width: number, height: number)
  {
    const camera = CameraManager.current as Camera as ThreePerspectiveCamera | OrthographicCamera;

    if ((camera as OrthographicCamera).isOrthographicCamera)
    {
      return new OrthographicFrustumPointFitter().get_zoom_to_fit_size(camera as OrthographicCamera, width * 2, height * 2);
    }

    const perspective_camera = camera as ThreePerspectiveCamera;
    const v_fov = (perspective_camera.fov / 2) * Math.PI / 180;
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * perspective_camera.aspect)) / 2;

    const distV = height / Math.tan(v_fov);
    const distH = width / Math.tan(h_fov);

    return Math.max(Math.abs(distH), Math.abs(distV));
  }

  // For a perspective camera this is a distance; for an orthographic camera it
  // is the camera zoom.
  get_zoom_to_fit_box(bb: Box3, camera: Camera)
  {
    camera = camera || CameraManager.current;

    if (bb.isEmpty())
    {
      return (camera as OrthographicCamera).isOrthographicCamera ? (camera as OrthographicCamera).zoom : 0;
    }

    return this.fit_bounding_box_points(camera, bb).zoom;
  }

  get_html_screen_pos(object: Object3D, camera: Camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    object.getWorldPosition(tmp_vec);
    tmp_vec.project(camera);

    tmp_vec.x = (tmp_vec.x * 0.5 + 0.5) * (OScreen.width);
    tmp_vec.y = (1 - (tmp_vec.y * 0.5 + 0.5)) * OScreen.height;
    return tmp_vec;
  }

  world_pos_to_screen(pos: any, camera: any)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.copy(pos);
    tmp_vec.project(camera);

    tmp_vec.x = (tmp_vec.x * 0.5 + 0.5) * (OScreen.width);
    tmp_vec.y = (1 - (tmp_vec.y * 0.5 + 0.5)) * OScreen.height;
    return tmp_vec;
  }

  update_projection(camera: Camera)
  {
    const orthographic_camera = camera as OrthographicCamera & { aspect: number };

    orthographic_camera.left   = -OScreen.width / 2;
    orthographic_camera.right  = OScreen.width / 2;
    orthographic_camera.top    = OScreen.height / 2;
    orthographic_camera.bottom = -OScreen.height / 2;
    orthographic_camera.aspect = OScreen.aspect_ratio;
    orthographic_camera.updateProjectionMatrix();
  }

  fit_bounding_box_points(camera: Camera, bb: Box3, scale = 1)
  {
    const dir = new Vector3();
    dir.copy(bb.max).sub(bb.min);

    const p1 = bb.min.clone();

    const p2 = p1.clone().add(new Vector3(dir.x, 0, 0));
    const p3 = p1.clone().add(new Vector3(0, dir.y, 0));
    const p4 = p1.clone().add(new Vector3(0, 0, dir.z));

    const p5 = p1.clone().add(new Vector3(dir.x, 0, dir.z));
    const p6 = p1.clone().add(new Vector3(0, dir.y, dir.z));
    const p7 = bb.max.clone();
    const p8 = p1.clone().add(new Vector3(dir.x, dir.y, 0));
    return this.fit_points(camera, [p1, p2, p3, p4, p5, p6, p7, p8], scale);
  }

  fit_points(camera: Camera, points: Array<Vector3>, zoom_scale = 1)
  {
    const perspective_camera = camera as ThreePerspectiveCamera;

    if (perspective_camera.isPerspectiveCamera)
    {
      const camera_forward_dir = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const camera_backward_dir = camera_forward_dir.clone().multiplyScalar(-1);

      const fitter = new PerspectiveFrustumPointFitter();

      const camera_pos = fitter.fit_points(points, camera.quaternion, perspective_camera.fov * zoom_scale, perspective_camera.aspect);
      const box = new Box3().setFromPoints(points);
      const center = new Vector3();
      box.getCenter(center);

      const reference_position_plane = new Plane().setFromNormalAndCoplanarPoint(camera_backward_dir, center);

      const camera_ray = new Ray(camera_pos, camera_forward_dir);

      const reference_position = new Vector3();
      camera_ray.intersectPlane(reference_position_plane, reference_position);

      const zoom = camera_pos.distanceTo(reference_position);

      return {
        zoom: zoom,
        reference_position: reference_position,
        camera_position: camera_pos
      };
    }
    else
    {
      // An orthographic camera frames through its zoom. It keeps its distance
      // to the points when that fits their depth between the near and far planes.
      const orthographic_camera = camera as OrthographicCamera;
      const fitter = new OrthographicFrustumPointFitter();
      const bounds = fitter.get_view_bounds(points, camera.quaternion);
      const camera_backward_dir = new Vector3(0, 0, 1).applyQuaternion(camera.quaternion);

      const current_distance = camera.position.clone().sub(bounds.center).dot(camera_backward_dir);
      const distance = fitter.get_distance_to_fit_depth(orthographic_camera, bounds.size.z / 2, current_distance);

      return {
        zoom: fitter.get_zoom_to_fit_size(orthographic_camera, bounds.size.x, bounds.size.y, zoom_scale),
        reference_position: bounds.center,
        camera_position: bounds.center.clone().addScaledVector(camera_backward_dir, distance)
      };
    }
  }
}

const camera_utilities = new CameraUtilities();
export { camera_utilities as CameraUtilities };
