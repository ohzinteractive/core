import { CameraManager } from '../CameraManager';
import { OMath } from '../utilities/OMath';
import { OScreen } from '../OScreen';

import { Vector3 } from 'three';
import { Matrix4 } from 'three';
import { Plane } from 'three';
import { Ray } from 'three';
import { Sphere } from 'three';
import { Box3 } from 'three';
import { PerspectiveFrustumPointFitter } from './PerspectiveFrustumPointFitter';
import { OrthographicFrustumPointFitter } from './OrthographicFrustumPointFitter';

class CameraUtilities
{
  init(input)
  {
    this.tmp_mat = new Matrix4();
    this.plane = new Plane();
    this.ray = new Ray();

    this.tmp_size = new Vector3();
    this.tmp_unproj = new Vector3();

    this.input = input;
  }

  get_up_dir(camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.set(0, 1, 0);
    tmp_vec.applyQuaternion(camera.quaternion);

    return tmp_vec;
  }

  get_forward_dir(camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.set(0, 0, -1);
    tmp_vec.applyQuaternion(camera.quaternion);

    return tmp_vec;
  }

  get_right_dir(camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.set(1, 0, 0);
    tmp_vec.applyQuaternion(camera.quaternion);
    return tmp_vec;
  }

  unproject_mouse_position(NDC, camera)
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

  get_plane_intersection(plane_position, plane_normal, NDC, camera)
  {
    camera = camera || CameraManager.current;
    NDC = NDC || this.input.NDC;

    const tmp_vec = new Vector3();

    this.plane.setFromNormalAndCoplanarPoint(plane_normal || this.get_forward_dir(camera), plane_position);
    if (camera.isPerspectiveCamera)
    {
      this.ray.set(camera.position, this.unproject_mouse_position(NDC, camera));
    }
    else
    {
      const pos = new Vector3(NDC.x * camera.right, NDC.y * camera.top, 0);
      pos.applyQuaternion(camera.quaternion);
      pos.add(camera.position);
      const dir = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      this.ray.set(pos, dir);
    }
    this.ray.intersectPlane(this.plane, tmp_vec);

    return tmp_vec;
  }

  fit_points_on_camera(points, zoom_scale = 1)
  {
    const points_sphere = new Sphere().setFromPoints(points);
    const world_space_center = points_sphere.center;
    const camera_forward = this.get_forward_dir(CameraManager.current).clone();

    const plane = new Plane().setFromNormalAndCoplanarPoint(camera_forward, world_space_center);

    const points_on_plane = OMath.project_points_on_plane(points, plane);

    const projected_points_center = new Vector3();
    let box =  new Box3().setFromPoints(points_on_plane);
    box.getCenter(projected_points_center);

    const up = new Vector3(0, 1, 0).applyQuaternion(CameraManager.current.quaternion);
    const right = up.clone().cross(camera_forward).normalize();
    const mat = new Matrix4().set(right.x, up.x, camera_forward.x, world_space_center.x,
      right.y, up.y, camera_forward.y, world_space_center.y,
      right.z, up.z, camera_forward.z, world_space_center.z,
      0,    0,                0,        1);

    const inverse_mat = new Matrix4().getInverse(mat);
    for (let i = 0; i < points_on_plane.length; i++)
    {
      points_on_plane[i].applyMatrix4(inverse_mat);
    }

    const size = new Vector3();
    box =  new Box3().setFromPoints(points_on_plane);
    box.getSize(size);
    size.multiplyScalar(zoom_scale);
    const projected_center = new Vector3();
    box.getCenter(projected_center);

    return {
      position: projected_points_center,
      zoom: this.get_zoom_to_fit_rect(size.x / 2, size.y / 2)
    };
  }

  get_zoom_to_fit_rect(width, height)
  {
    const v_fov = (CameraManager.current.fov / 2) * Math.PI / 180;
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * CameraManager.current.aspect)) / 2;

    const distV = height / Math.tan(v_fov);
    const distH = width / Math.tan(h_fov);

    return Math.max(Math.abs(distH), Math.abs(distV));
  }

  get_zoom_to_fit_box(bb, camera)
  {
    if (camera.isOrthographicCamera)
    {
      bb.getSize(this.tmp_size);

      const obj_x = this.tmp_size.x;
      const obj_y = this.tmp_size.y;
      const object_aspect = obj_x / obj_y;
      if (OScreen.aspect_ratio / object_aspect > 1)
      {
        return OScreen.height / obj_y;
      }
      else
      {
        return OScreen.width / obj_x;
      }
    }
    else
    {
      // return this.fit_points_on_camera([bb.min, bb.max], 1).zoom;
      const size = new Vector3();
      bb.getSize(size);
      return this.get_zoom_to_fit_rect(size.x, size.y);
    }
  }

  get_html_screen_pos(object, camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    object.getWorldPosition(tmp_vec);
    tmp_vec.project(camera);

    tmp_vec.x = (tmp_vec.x * 0.5 + 0.5) * (OScreen.width);
    tmp_vec.y = (1 - (tmp_vec.y * 0.5 + 0.5)) * OScreen.height;
    return tmp_vec;
  }

  world_pos_to_screen(pos, camera)
  {
    camera = camera || CameraManager.current;
    const tmp_vec = new Vector3();

    tmp_vec.copy(pos);
    tmp_vec.project(camera);

    tmp_vec.x = (tmp_vec.x * 0.5 + 0.5) * (OScreen.width);
    tmp_vec.y = (1 - (tmp_vec.y * 0.5 + 0.5)) * OScreen.height;
    return tmp_vec;
  }

  update_projection(camera)
  {
    camera.left   = -OScreen.width / 2;
    camera.right  = OScreen.width / 2;
    camera.top    = OScreen.height / 2;
    camera.bottom = -OScreen.height / 2;
    camera.aspect = OScreen.aspect_ratio;
    camera.updateProjectionMatrix(true);
  }

  fit_bounding_box_points(camera, bb, scale = 1)
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

  fit_points(camera, points, zoom_scale = 1)
  {
    if (camera.isPerspectiveCamera)
    {
      const camera_forward_dir = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const camera_backward_dir = camera_forward_dir.clone().multiplyScalar(-1);

      const fitter = new PerspectiveFrustumPointFitter();

      const aspect_ratio = OScreen.aspect_ratio;

      const camera_pos = fitter.fit_points(points, camera.quaternion, camera.fov * zoom_scale, aspect_ratio);
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
      const fitter = new OrthographicFrustumPointFitter();
      const result = fitter.fit_points(points, this.reference_rotation, camera.fov * zoom_scale, OScreen.aspect_ratio);

      this.reference_position.copy(result.center);
      this.reference_zoom = result.distance_to_center;

      const forward = new Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
      return {
        zoom: result.distance_to_center,
        reference_position: result.center,
        camera_position: forward.multiplyScalar(result.distance_to_center)
      };
    }
  }
}

const camera_utilities = new CameraUtilities();
export { camera_utilities as CameraUtilities };
