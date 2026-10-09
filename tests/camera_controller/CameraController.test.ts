import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Plane, Points, Quaternion, Sphere, Vector3 } from 'three';
import { PerspectiveCamera } from 'three';
import { CameraController } from '../../src/camera_controller/CameraController';
import { CameraMovementMode } from '../../src/camera_controller/movement_mode/CameraMovementMode';
import { ImmediateMode } from '../../src/camera_controller/movement_mode/ImmediateMode';
import { AbstractCameraState } from '../../src/camera_controller/states/common/AbstractCameraState';
import { OScreen } from '../../src/OScreen';

function controller(input: unknown = {})
{
  return new CameraController(input as never);
}

function controller_with_camera()
{
  const camera_controller = controller();
  camera_controller.set_camera(new PerspectiveCamera(60, 16 / 9, 0.1, 1000));
  return camera_controller;
}

function spy_state()
{
  const state = new AbstractCameraState();
  vi.spyOn(state, 'on_enter');
  vi.spyOn(state, 'on_exit');
  vi.spyOn(state, 'update');
  return state;
}

function spy_mode()
{
  const mode = new CameraMovementMode();
  vi.spyOn(mode, 'on_enter');
  vi.spyOn(mode, 'on_exit');
  vi.spyOn(mode, 'update');
  return mode;
}

beforeEach(() =>
{
  OScreen.init();
  OScreen.update_size(1600, 900);
});

describe('CameraController construction', () =>
{
  it('starts idle, in immediate mode, with input enabled', () =>
  {
    const input = {};
    const camera_controller = controller(input);

    expect(camera_controller.input).toBe(input);
    expect(camera_controller.camera).toBeUndefined();
    expect(camera_controller.current_state.constructor).toBe(AbstractCameraState);
    expect(camera_controller.current_mode).toBeInstanceOf(ImmediateMode);
    expect(camera_controller.input_enabled).toBe(true);
  });

  it('starts at the origin, unrotated, with the default zoom range', () =>
  {
    const camera_controller = controller();

    expect(camera_controller.reference_position.equals(new Vector3())).toBe(true);
    expect(camera_controller.reference_rotation.equals(new Quaternion())).toBe(true);
    expect(camera_controller.reference_zoom).toBe(10);
    expect(camera_controller.min_zoom).toBe(1);
    expect(camera_controller.max_zoom).toBe(400);
    expect(camera_controller.normalized_zoom).toBe(0);
    expect(camera_controller.get_current_tilt()).toBe(0);
    expect(camera_controller.get_current_orientation()).toBe(0);
    expect(camera_controller.get_current_azimuth()).toBe(0);
  });
});

describe('CameraController.enable / disable', () =>
{
  it('toggles input_enabled', () =>
  {
    const camera_controller = controller();

    camera_controller.disable();
    expect(camera_controller.input_enabled).toBe(false);

    camera_controller.enable();
    expect(camera_controller.input_enabled).toBe(true);
  });
});

describe('CameraController.set_camera', () =>
{
  it('stores the camera and a copy of its initial transform', () =>
  {
    const camera_controller = controller();
    const camera = new PerspectiveCamera();
    camera.position.set(1, 2, 3);
    camera.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0.5);

    camera_controller.set_camera(camera);
    camera.position.set(9, 9, 9);
    camera.quaternion.identity();

    expect(camera_controller.camera).toBe(camera);
    expect(camera_controller.camera_initial_pos.toArray()).toEqual([1, 2, 3]);
    expect(camera_controller.camera_initial_rot.angleTo(new Quaternion())).toBeCloseTo(0.5, 6);
  });
});

describe('CameraController.set_state / set_idle', () =>
{
  it('exits the old state and enters the new one', () =>
  {
    const camera_controller = controller();
    const first = spy_state();
    const second = spy_state();

    camera_controller.set_state(first);
    camera_controller.set_state(second);

    expect(first.on_enter).toHaveBeenCalledWith(camera_controller);
    expect(first.on_exit).toHaveBeenCalledWith(camera_controller);
    expect(second.on_enter).toHaveBeenCalledWith(camera_controller);
    expect(second.on_exit).not.toHaveBeenCalled();
    expect(camera_controller.current_state).toBe(second);
  });

  it('set_idle exits the current state and goes back to an idle one', () =>
  {
    const camera_controller = controller();
    const state = spy_state();
    camera_controller.set_state(state);

    camera_controller.set_idle();

    expect(state.on_exit).toHaveBeenCalledWith(camera_controller);
    expect(camera_controller.current_state).not.toBe(state);
    expect(camera_controller.current_state.constructor).toBe(AbstractCameraState);
  });
});

describe('CameraController.set_mode', () =>
{
  it('exits the old mode and enters the new one', () =>
  {
    const camera_controller = controller();
    const first = spy_mode();
    const second = spy_mode();

    camera_controller.set_mode(first);
    camera_controller.set_mode(second);

    expect(first.on_enter).toHaveBeenCalledWith(camera_controller);
    expect(first.on_exit).toHaveBeenCalledWith(camera_controller);
    expect(second.on_enter).toHaveBeenCalledWith(camera_controller);
    expect(camera_controller.current_mode).toBe(second);
  });
});

describe('CameraController normalized zoom', () =>
{
  it('set_normalized_zoom clamps to [0, 1]', () =>
  {
    const camera_controller = controller();

    camera_controller.set_normalized_zoom(0.4);
    expect(camera_controller.normalized_zoom).toBe(0.4);

    camera_controller.set_normalized_zoom(-1);
    expect(camera_controller.normalized_zoom).toBe(0);

    camera_controller.set_normalized_zoom(2);
    expect(camera_controller.normalized_zoom).toBe(1);
  });

  it('update_normalized_zoom maps the camera distance from 1 (closest) to 0 (farthest)', () =>
  {
    const camera_controller = controller_with_camera();
    camera_controller.reference_position.set(5, 0, 0);

    camera_controller.camera.position.set(5, 0, 10);
    camera_controller.update_normalized_zoom(10, 30);
    expect(camera_controller.normalized_zoom).toBeCloseTo(1, 6);

    camera_controller.camera.position.set(5, 0, 20);
    camera_controller.update_normalized_zoom(10, 30);
    expect(camera_controller.normalized_zoom).toBeCloseTo(0.5, 6);

    camera_controller.camera.position.set(5, 0, 30);
    camera_controller.update_normalized_zoom(10, 30);
    expect(camera_controller.normalized_zoom).toBeCloseTo(0, 6);
  });

  it('update_normalized_zoom clamps distances outside the range', () =>
  {
    const camera_controller = controller_with_camera();

    camera_controller.camera.position.set(0, 0, 1);
    camera_controller.update_normalized_zoom(10, 30);
    expect(camera_controller.normalized_zoom).toBe(1);

    camera_controller.camera.position.set(0, 0, 100);
    camera_controller.update_normalized_zoom(10, 30);
    expect(camera_controller.normalized_zoom).toBe(0);
  });

  it('camera_is_zoomed_out below a normalized zoom of 0.2', () =>
  {
    const camera_controller = controller();

    camera_controller.set_normalized_zoom(0.19);
    expect(camera_controller.camera_is_zoomed_out()).toBe(true);

    camera_controller.set_normalized_zoom(0.2);
    expect(camera_controller.camera_is_zoomed_out()).toBe(false);
  });
});

describe('CameraController.update', () =>
{
  it('updates the state, then the mode, then the normalized zoom', () =>
  {
    const camera_controller = controller_with_camera();
    const calls: string[] = [];
    const state = new AbstractCameraState();
    const mode = new CameraMovementMode();
    state.update = () =>
    {
      calls.push('state');
    };
    mode.update = () =>
    {
      calls.push('mode');
      camera_controller.camera.position.set(0, 0, 400);
    };
    camera_controller.set_state(state);
    camera_controller.set_mode(mode);
    camera_controller.set_normalized_zoom(1);

    camera_controller.update();

    expect(calls).toEqual(['state', 'mode']);
    // The mode moved the camera to max_zoom, so this was computed after it.
    expect(camera_controller.normalized_zoom).toBe(0);
  });

  it('places the camera through the default immediate mode', () =>
  {
    const camera_controller = controller_with_camera();
    camera_controller.reference_position.set(1, 2, 3);
    camera_controller.reference_zoom = 20;

    camera_controller.update();

    expect(camera_controller.camera.position.x).toBeCloseTo(1, 6);
    expect(camera_controller.camera.position.y).toBeCloseTo(2, 6);
    expect(camera_controller.camera.position.z).toBeCloseTo(23, 6);
  });

  it('moves the debug box to the reference position when there is one', () =>
  {
    const camera_controller = controller_with_camera();
    const debug_box = { position: new Vector3() };
    camera_controller.debug_box = debug_box as never;
    camera_controller.reference_position.set(4, 5, 6);

    camera_controller.update();

    expect(debug_box.position.toArray()).toEqual([4, 5, 6]);
  });
});

describe('CameraController.translate_forward / translate_right', () =>
{
  it('moves the reference position along the camera local +Z axis', () =>
  {
    const camera_controller = controller_with_camera();
    camera_controller.camera.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    camera_controller.translate_forward(2);

    // Local +Z rotated 90 degrees about Y is world +X.
    expect(camera_controller.reference_position.x).toBeCloseTo(2, 6);
    expect(camera_controller.reference_position.y).toBeCloseTo(0, 6);
    expect(camera_controller.reference_position.z).toBeCloseTo(0, 6);
  });

  it('moves the reference position along the camera local +X axis', () =>
  {
    const camera_controller = controller_with_camera();
    camera_controller.camera.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    camera_controller.translate_right(3);

    // Local +X rotated 90 degrees about Y is world -Z.
    expect(camera_controller.reference_position.x).toBeCloseTo(0, 6);
    expect(camera_controller.reference_position.z).toBeCloseTo(-3, 6);
  });

  it('accumulates', () =>
  {
    const camera_controller = controller_with_camera();

    camera_controller.translate_right(1);
    camera_controller.translate_right(1);
    camera_controller.translate_forward(-4);

    expect(camera_controller.reference_position.toArray()).toEqual([2, 0, -4]);
  });
});

describe('CameraController debug helpers', () =>
{
  function make_points(count: number)
  {
    const points = [];
    for (let i = 0; i < count; i++)
    {
      points.push(new Points());
    }
    return points;
  }

  it('show_projected_points shows one helper per point, at that point', () =>
  {
    const camera_controller = controller();
    camera_controller.projected_points = make_points(3);

    camera_controller.show_projected_points([new Vector3(1, 0, 0), new Vector3(0, 2, 0)]);

    expect(camera_controller.projected_points.map(p => p.visible)).toEqual([true, true, false]);
    expect(camera_controller.projected_points[1].position.toArray()).toEqual([0, 2, 0]);
  });

  it('hide_projected_points hides every helper', () =>
  {
    const camera_controller = controller();
    camera_controller.projected_points = make_points(2);

    camera_controller.hide_projected_points();

    expect(camera_controller.projected_points.map(p => p.visible)).toEqual([false, false]);
  });

  it('show_plane_projection sets up and shows the plane helper', () =>
  {
    const camera_controller = controller();
    const plane = new Plane(new Vector3(0, 1, 0), -2);

    camera_controller.show_plane_projection(plane, 5);

    expect(camera_controller.projection_plane_helper.plane).toBe(plane);
    expect(camera_controller.projection_plane_helper.size).toBe(5);
    expect(camera_controller.projection_plane_helper.visible).toBe(true);
  });

  it('show_sphere_projection scales and places the sphere helper', () =>
  {
    const camera_controller = controller();
    const helper = { scale: new Vector3(), position: new Vector3(), visible: false };
    camera_controller.projection_sphere_helper = helper as never;

    camera_controller.show_sphere_projection(new Sphere(new Vector3(1, 2, 3), 4) as never);

    expect(helper.scale.toArray()).toEqual([4, 4, 4]);
    expect(helper.position.toArray()).toEqual([1, 2, 3]);
    expect(helper.visible).toBe(true);
  });
});
