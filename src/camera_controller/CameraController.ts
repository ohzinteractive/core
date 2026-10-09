import { ImmediateMode } from './movement_mode/ImmediateMode';

import type { OrthographicCamera, PerspectiveCamera, Points } from 'three';
import { PlaneHelper, Quaternion, Vector3 } from 'three';
// import { PlaneHelper } from 'three';
import { Plane } from 'three';
// import { Sphere } from 'three';
import { Box3, Ray } from 'three';

import { OScreen } from '../OScreen';
import type { Input } from '../lib/Input';
import type { Cube } from '../primitives/Cube';
import type { Sphere } from '../primitives/Sphere';
import { OMath } from '../utilities/OMath';
import { OrthographicFrustumPointFitter } from '../utilities/OrthographicFrustumPointFitter';
import { PerspectiveFrustumPointFitter } from '../utilities/PerspectiveFrustumPointFitter';
import type { CameraMovementMode } from './movement_mode/CameraMovementMode';
import { AbstractCameraState } from './states/common/AbstractCameraState';

export class CameraController
{
  __last_reference_position: Vector3;
  camera: PerspectiveCamera | OrthographicCamera;
  camera_initial_pos: Vector3;
  camera_initial_rot: Quaternion;
  current_azimuth: number;
  current_mode: CameraMovementMode;
  current_orientation: number;
  current_state: AbstractCameraState;
  current_tilt: number;
  debug_box: Cube;
  input: Input;
  input_enabled: boolean;
  max_zoom: number;
  min_zoom: number;
  normalized_zoom: number;
  old_orientation: number;
  orientation: number;
  point_of_interest: Vector3;
  projected_points: Points[];
  projection_plane_helper: PlaneHelper;
  projection_sphere_helper: Sphere;
  raised_look_at_position: Vector3;
  reference_position: Vector3;
  reference_rotation: Quaternion;
  reference_zoom: number;
  tilt: number;
  tmp_dir: Vector3;
  tmp_forward: Vector3;
  tmp_quat: Quaternion;
  tmp_right: Vector3;
  tmp_size: Vector3;
  use_raised_look_at_direction: number;
  vector_forward_axis: Vector3;
  vector_right_axis: Vector3;
  vector_up_axis: Vector3;
  zoom: number;

  constructor(input: Input)
  {
    this.input = input;

    this.camera = undefined;
    this.camera_initial_rot = undefined;
    this.camera_initial_pos = undefined;
    this.current_state = new AbstractCameraState();

    this.current_mode = new ImmediateMode();

    this.point_of_interest = new Vector3();
    this.normalized_zoom = 0;

    this.vector_up_axis   = new Vector3(0, 1, 0);
    this.vector_right_axis = new Vector3(1, 0, 0);
    this.vector_forward_axis = new Vector3(0, 0, 1);
    this.tmp_forward = this.vector_forward_axis.clone();
    this.tmp_right = this.vector_right_axis.clone();

    this.tmp_dir = new Vector3();

    this.zoom = 10;
    this.reference_zoom = 10;
    this.orientation = 27; // degrees
    this.tilt = 70;

    this.reference_rotation = new Quaternion();
    this.reference_position = new Vector3();
    this.__last_reference_position = new Vector3();

    this.tmp_size = new Vector3();
    this.tmp_quat = new Quaternion();

    this.min_zoom = 1;
    this.max_zoom = 400;

    this.current_tilt = 0;
    this.current_orientation = 0;
    this.current_azimuth = 0;

    this.projection_plane_helper = new PlaneHelper(new Plane(), 1, 0xffff00);

    this.input_enabled = true;
    // this.debug_box = Debug.draw_cube(undefined,15);
    // this.debug_zoom_box = Debug.draw_sphere(undefined,15, 0x00ff00);

    this.raised_look_at_position = new Vector3(-82.2986094900191, 0, 39.7538467209173);
    this.use_raised_look_at_direction = 0;
  }

  enable()
  {
    this.input_enabled = true;
  }

  disable()
  {
    this.input_enabled = false;
  }

  set_camera(camera: PerspectiveCamera | OrthographicCamera)
  {
    this.camera = camera;
    this.camera_initial_rot = camera.quaternion.clone();
    this.camera_initial_pos = camera.position.clone();
  }

  set_state(state: AbstractCameraState)
  {
    // console.log("camera controller state switch to: " + state.constructor.name);
    this.current_state.on_exit(this);
    this.current_state = state;
    this.current_state.on_enter(this);
  }

  set_mode(mode: CameraMovementMode)
  {
    // console.log("camera controller mode switch to: " + mode.constructor.name);

    this.current_mode.on_exit(this);
    this.current_mode = mode;
    this.current_mode.on_enter(this);
  }

  set_normalized_zoom(zoom: number)
  {
    this.normalized_zoom = OMath.clamp(zoom, 0, 1);
  }

  update_normalized_zoom(min_zoom: number, max_zoom: number)
  {
    const zoom = this.camera.position.distanceTo(this.reference_position);
    this.normalized_zoom = OMath.linear_map(zoom, min_zoom, max_zoom, 1, 0);
    this.normalized_zoom = OMath.clamp(this.normalized_zoom, 0, 1);
  }

  // update_initial_rotation()
  // {
  //   this.current_state.update_initial_rotation();
  // }

  update()
  {
    if (this.debug_box)
    {
      this.debug_box.position.copy(this.reference_position);
    }

    // this.debug_zoom_box.position.copy(this.reference_position)
    // this.debug_zoom_box.position.add(new Vector3(0,0,1).applyQuaternion(this.camera.quaternion).multiplyScalar(this.reference_zoom));

    this.current_state.update(this);
    this.current_mode.update(this);
    this.update_normalized_zoom(this.min_zoom, this.max_zoom);
  }

  set_idle()
  {
    this.set_state(new AbstractCameraState());
  }

  camera_is_zoomed_out()
  {
    return this.normalized_zoom < 0.2;
  }

  // Arguments are nullish-checked, not falsy-checked: a falsy check discards a
  // value of 0, which made it impossible to return any angle to zero.
  set_rotation(tilt?: number, orientation?: number, azimuth?: number)
  {
    this.old_orientation = this.current_orientation;

    this.current_tilt = tilt ?? this.current_tilt;
    this.current_orientation = orientation ?? this.current_orientation;
    this.current_azimuth = azimuth ?? this.current_azimuth;

    this.set_quaternion(this.build_rotation(this.current_tilt, this.current_orientation)); //, this.current_azimuth
  }

  set_rotation_delta(tilt: number, orientation: number, azimuth = 0)
  {
    this.lerp_rotation(
      this.current_tilt, this.current_tilt + tilt,
      this.current_orientation, this.current_orientation + orientation,
      this.current_azimuth, this.current_azimuth + azimuth,
      1
    );
  }

  lerp_tilt(from_tilt: number, to_tilt: number, t: number)
  {
    this.lerp_rotation(
      from_tilt, to_tilt,
      this.current_orientation, this.current_orientation,
      this.current_azimuth,     this.current_azimuth,
      t);
  }

  set_quaternion(q: Quaternion)
  {
    const xΘ = Math.atan2(q.x, q.w)  * 2;
    const yΘ = Math.atan2(q.y, q.w)  * 2;

    // Both angles come out up to 360 degrees off: past an orientation of 180,
    // and for -q, which is the same rotation. Orientation is kept in [0, 360),
    // like build_rotation, and tilt in (-180, 180].
    this.current_orientation = OMath.euclideanModulo(OMath.radToDeg(yΘ), 360);
    this.current_tilt        = 180 - OMath.euclideanModulo(180 + OMath.radToDeg(xΘ), 360);

    this.reference_rotation.copy(q);
  }

  lerp_quaternion(q: Quaternion, t: number)
  {
    this.set_quaternion(this.reference_rotation.clone().slerp(q, t));
  }

  lerp_orientation(from_orientation: number, to_orientation: number, t: number)
  {
    this.lerp_rotation(
      this.current_tilt, this.current_tilt,
      from_orientation, to_orientation,
      this.current_azimuth, this.current_azimuth,
      t);
  }

  lerp_azimuth(from_azimuth: number, to_azimuth: number, t: number)
  {

  }

  lerp_rotation(from_tilt: number, to_tilt: number, from_orientation: number, to_orientation: number, from_azimuth: number, to_azimuth: number, t: number)
  {
    const from_quat = this.build_rotation(from_tilt, from_orientation);
    const to_quat   = this.build_rotation(to_tilt, to_orientation);

    from_quat.slerp(to_quat, t);

    this.set_quaternion(from_quat);
  }

  build_rotation(tilt: number, orientation: number)
  {
    if (orientation < 0)
    {
      orientation = orientation + 360;
    }
    const new_orientation = new Quaternion().setFromAxisAngle(this.vector_up_axis, ((orientation % 360) / 360) * Math.PI * 2);
    const new_tilt = new Quaternion().setFromAxisAngle(this.vector_right_axis, (-tilt / 360) * Math.PI * 2);

    return new_orientation.multiply(new_tilt);
  }

  translate_forward(amount: number)
  {
    this.tmp_forward.copy(this.vector_forward_axis);
    this.tmp_forward.applyQuaternion(this.camera.quaternion);
    this.reference_position.add(this.tmp_forward.multiplyScalar(amount));
  }

  translate_right(amount: number)
  {
    this.tmp_right.copy(this.vector_right_axis);
    this.tmp_right.applyQuaternion(this.camera.quaternion);
    this.reference_position.add(this.tmp_right.multiplyScalar(amount));
  }

  focus_on_bounding_box(bb: Box3, scale = 1)
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

    this.focus_camera_on_points([p1, p2, p3, p4, p5, p6, p7, p8], scale);
  }

  // get_zoom_to_focus_on_bounding_box(bb, tilt, orientation)
  // {
  //   if (tilt !== undefined && orientation !== undefined)
  //   {
  //     this.tmp_quat.copy(this.reference_rotation); // backup quaternion
  //     this.reference_rotation.copy(this.build_rotation(tilt, orientation, this.current_azimuth));
  //   }
  //   const original_zoom = this.reference_zoom;
  //   const original_pos = new Vector3().copy(this.reference_position);
  //   this.focus_camera_on_bounding_box(bb);
  //   const target_zoom = this.reference_zoom;
  //   this.reference_position.copy(original_pos);
  //   this.reference_zoom = original_zoom;

  //   if (tilt !== undefined && orientation !== undefined)
  //   {
  //     this.reference_rotation.copy(this.tmp_quat);
  //   }

  //   return target_zoom;
  // }

  get_zoom_to_focus_on_points(points: Vector3[], scale: number)
  {
    if (this.__is_orthographic())
    {
      return this.__fit_orthographic(this.reference_rotation, points, scale).zoom;
    }

    const old_zoom = this.reference_zoom;
    const old_pos = new Vector3().copy(this.reference_position);
    this.focus_camera_on_points(points, scale);
    const new_zoom = this.reference_zoom;
    this.reference_zoom = old_zoom;
    this.reference_position.copy(old_pos);
    return new_zoom;
  }

  get_target_pos_to_focus_on_points(points: Vector3[], scale: number)
  {
    if (this.__is_orthographic())
    {
      return this.__fit_orthographic(this.reference_rotation, points, scale).center;
    }

    const old_zoom = this.reference_zoom;
    const old_pos = new Vector3().copy(this.reference_position);
    this.focus_camera_on_points(points, scale);

    const new_pos = this.reference_position.clone();
    this.reference_zoom = old_zoom;
    this.reference_position.copy(old_pos);

    return new_pos;
  }

  focus_camera_on_sphere(sphere: Sphere, debug: boolean)
  {
    if (this.__is_orthographic())
    {
      this.__set_orthographic_zoom(this.get_zoom_to_sphere(sphere, debug));
      this.reference_zoom = this.__get_orthographic_distance(sphere.radius);
    }
    else
    {
      this.reference_zoom = this.get_zoom_to_sphere(sphere, debug);
    }
    this.reference_position.copy(sphere.center);
  }

  // For a perspective camera this is a distance; for an orthographic camera it
  // is the camera zoom.
  get_zoom_to_sphere(sphere: Sphere, debug: boolean)
  {
    if (this.__is_orthographic())
    {
      return this.__get_orthographic_zoom(sphere.radius * 2, sphere.radius * 2);
    }

    const v_fov = ((this.camera as PerspectiveCamera).fov / 2) * Math.PI / 180;
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * (this.camera as PerspectiveCamera).aspect)) / 2;

    // if(debug )
    // {
    //   Debug.draw_math_sphere(sphere);
    // }
    // this.camera.zoom = 1/((sphere.radius*2) /(ViewApi.map.camera_controller.camera.top*2));
    // this.camera.updateProjectionMatrix();

    const distV = sphere.radius / Math.tan(v_fov);
    const distH = sphere.radius / Math.tan(h_fov);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }

  hide_projected_points()
  {
    for (let i = 0; i < this.projected_points.length; i++)
    {
      this.projected_points[i].visible = false;
    }
  }

  show_projected_points(points: Vector3[])
  {
    this.hide_projected_points();
    for (let i = 0; i < points.length; i++)
    {
      this.projected_points[i].visible = true;
      this.projected_points[i].position.copy(points[i]);
    }
  }

  show_plane_projection(plane: Plane, size = 1)
  {
    this.projection_plane_helper.plane = plane;
    this.projection_plane_helper.size = size;
    this.projection_plane_helper.updateMatrixWorld();
    this.projection_plane_helper.visible = true;
  }

  show_sphere_projection(sphere: Sphere)
  {
    this.projection_sphere_helper.scale.set(sphere.radius, sphere.radius, sphere.radius);
    this.projection_sphere_helper.position.copy(sphere.center);
    this.projection_sphere_helper.visible = true;
  }

  fit_points(quaternion: Quaternion, points: Vector3[], zoom_scale = 1)
  {
    if ((this.camera as PerspectiveCamera).isPerspectiveCamera)
    {
      const camera_forward_dir = new Vector3(0, 0, -1).applyQuaternion(quaternion);
      const camera_backward_dir = camera_forward_dir.clone().multiplyScalar(-1);

      const fitter = new PerspectiveFrustumPointFitter();

      const aspect_ratio = OScreen.aspect_ratio;

      const camera_pos = fitter.fit_points(points, quaternion, ((this.camera as PerspectiveCamera).fov * zoom_scale), aspect_ratio);
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
      const result = this.__fit_orthographic(quaternion, points, zoom_scale);
      const camera_backward_dir = new Vector3(0, 0, 1).applyQuaternion(quaternion);

      return {
        zoom: result.zoom,
        reference_position: result.center,
        camera_position: result.center.clone().add(camera_backward_dir.multiplyScalar(result.distance))
      };
    }
  }

  focus_camera_on_points(points: Vector3[], zoom_scale = 1)
  {
    if ((this.camera as PerspectiveCamera).isPerspectiveCamera)
    {
      const camera_forward_dir = new Vector3(0, 0, -1).applyQuaternion(this.reference_rotation);
      const camera_backward_dir = camera_forward_dir.clone().multiplyScalar(-1);

      const fitter = new PerspectiveFrustumPointFitter();

      const aspect_ratio = OScreen.aspect_ratio;

      const camera_pos = fitter.fit_points(points, this.reference_rotation, ((this.camera as PerspectiveCamera).fov * zoom_scale), aspect_ratio);
      const box = new Box3().setFromPoints(points);
      const center = new Vector3();
      box.getCenter(center);

      const reference_position_plane = new Plane().setFromNormalAndCoplanarPoint(camera_backward_dir, center);

      const camera_ray = new Ray(camera_pos, camera_forward_dir);

      const reference_position = new Vector3();
      camera_ray.intersectPlane(reference_position_plane, reference_position);

      const zoom = camera_pos.distanceTo(reference_position);

      this.reference_zoom = zoom;
      this.reference_position.copy(reference_position);
    }
    else
    {
      const result = this.__fit_orthographic(this.reference_rotation, points, zoom_scale);

      this.__set_orthographic_zoom(result.zoom);
      this.reference_zoom = result.distance;
      this.reference_position.copy(result.center);
    }
  }

  get_current_tilt()
  {
    return this.current_tilt;
  }

  get_current_orientation()
  {
    return this.current_orientation;
  }

  get_current_azimuth()
  {
    return this.current_azimuth;
  }

  __get_zoom_to_show_rect(width: number, height: number, scale = 1)
  {
    if (this.__is_orthographic())
    {
      return this.__get_orthographic_zoom(width * 2, height * 2) * scale;
    }

    // let v_fov = (this.camera.fov/2) * Math.PI/180;
    const v_fov = OMath.degToRad((this.camera as PerspectiveCamera).fov / 2);
    const h_fov = (2 * Math.atan(Math.tan(v_fov) * (this.camera as PerspectiveCamera).aspect)) / 2;

    const distV = height / Math.tan(v_fov * scale);
    const distH = width / Math.tan(h_fov * scale);
    return Math.max(Math.abs(distH), Math.abs(distV));
  }

  __is_orthographic()
  {
    return (this.camera as OrthographicCamera).isOrthographicCamera === true;
  }

  __fit_orthographic(quaternion: Quaternion, points: Vector3[], zoom_scale: number)
  {
    const bounds = new OrthographicFrustumPointFitter().get_view_bounds(points, quaternion);
    const size = bounds.size;

    // Points lined up along an axis leave rounding noise, not 0, across it.
    const epsilon = 1e-9 * Math.max(size.x, size.y, size.z);
    const width = size.x > epsilon ? size.x : 0;
    const height = size.y > epsilon ? size.y : 0;

    return {
      zoom: this.__get_orthographic_zoom(width, height) * zoom_scale,
      center: bounds.center,
      distance: this.__get_orthographic_distance(size.z / 2)
    };
  }

  // An orthographic camera frames through its zoom, so the distance only has to
  // keep a depth of +-half_depth around the center between the near and far
  // planes. The current distance is kept when it does. ImmediateMode still
  // clamps it to max_zoom, which must cover half the depth plus near.
  __get_orthographic_distance(half_depth: number)
  {
    const closest = half_depth + this.camera.near;
    const farthest = this.camera.far - half_depth;

    let distance = Math.max(this.reference_zoom, closest);
    if (distance > farthest)
    {
      distance = Math.max(closest, farthest);
    }
    return distance;
  }

  // The camera zoom that shows a width x height area, from the camera frustum.
  // A degenerate area keeps the current zoom.
  __get_orthographic_zoom(width: number, height: number)
  {
    const camera = this.camera as OrthographicCamera;
    const zoom = Math.min(
      Math.abs((camera.right - camera.left) / width),
      Math.abs((camera.top - camera.bottom) / height)
    );

    return Number.isFinite(zoom) ? zoom : camera.zoom;
  }

  __set_orthographic_zoom(zoom: number)
  {
    const camera = this.camera as OrthographicCamera;
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }
}
