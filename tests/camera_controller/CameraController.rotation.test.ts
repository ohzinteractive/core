import { describe, expect, it } from 'vitest';
import { Quaternion, Vector3 } from 'three';
import { CameraController } from '../../src/camera_controller/CameraController';

function controller()
{
  return new CameraController({} as never);
}

describe('CameraController.set_rotation', () =>
{
  it('applies a non-zero tilt and orientation', () =>
  {
    const camera_controller = controller();

    camera_controller.set_rotation(45, 60);

    // set_quaternion re-derives the angles from the quaternion, so these are
    // close rather than exact.
    expect(camera_controller.get_current_tilt()).toBeCloseTo(45, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(60, 6);
  });

  it('can set an angle back to zero', () =>
  {
    const camera_controller = controller();

    camera_controller.set_rotation(45, 60);
    camera_controller.set_rotation(0, 0);

    // toBeCloseTo, not toBe: tilt is derived as radToDeg(0) * -1, which is
    // negative zero. Mathematically zero, and JSON normalises it to 0.
    expect(camera_controller.get_current_tilt()).toBeCloseTo(0, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(0, 6);
  });

  it('can zero one angle while leaving the other', () =>
  {
    const camera_controller = controller();

    camera_controller.set_rotation(45, 60);
    camera_controller.set_rotation(0, undefined);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(0, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(60, 6);
  });

  it('keeps the current values when arguments are omitted', () =>
  {
    const camera_controller = controller();

    camera_controller.set_rotation(45, 60);
    camera_controller.set_rotation(undefined, undefined);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(45, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(60, 6);
  });

  it('leaves azimuth untouched when it is not supplied', () =>
  {
    const camera_controller = controller();

    camera_controller.current_azimuth = 15;
    camera_controller.set_rotation(45, 60);

    expect(camera_controller.get_current_azimuth()).toBe(15);
  });

  it('sets azimuth to zero when zero is supplied', () =>
  {
    const camera_controller = controller();

    camera_controller.current_azimuth = 15;
    camera_controller.set_rotation(45, 60, 0);

    expect(camera_controller.get_current_azimuth()).toBe(0);
  });

  it('records the previous orientation', () =>
  {
    const camera_controller = controller();

    camera_controller.set_rotation(0, 90);
    camera_controller.set_rotation(0, 120);

    expect(camera_controller.old_orientation).toBeCloseTo(90, 6);
  });
});

function forward_of(q: Quaternion)
{
  return new Vector3(0, 0, -1).applyQuaternion(q);
}

describe('CameraController.build_rotation', () =>
{
  it('turns a positive tilt into looking down', () =>
  {
    const forward = forward_of(controller().build_rotation(90, 0));

    expect(forward.x).toBeCloseTo(0, 6);
    expect(forward.y).toBeCloseTo(-1, 6);
    expect(forward.z).toBeCloseTo(0, 6);
  });

  it('turns orientation counterclockwise about +Y', () =>
  {
    const forward = forward_of(controller().build_rotation(0, 90));

    expect(forward.x).toBeCloseTo(-1, 6);
    expect(forward.z).toBeCloseTo(0, 6);
  });

  it('treats a negative orientation like its positive equivalent', () =>
  {
    const camera_controller = controller();

    const negative = camera_controller.build_rotation(20, -90);
    const positive = camera_controller.build_rotation(20, 270);

    expect(negative.angleTo(positive)).toBeCloseTo(0, 6);
  });
});

describe('CameraController.set_quaternion', () =>
{
  it('copies the rotation and derives tilt and orientation from it', () =>
  {
    const camera_controller = controller();
    const q = camera_controller.build_rotation(25, 40);

    camera_controller.set_quaternion(q);

    expect(camera_controller.reference_rotation.equals(q)).toBe(true);
    expect(camera_controller.reference_rotation).not.toBe(q);
    expect(camera_controller.get_current_tilt()).toBeCloseTo(25, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(40, 6);
  });

  it('reports orientations past 180 degrees without corrupting the tilt', () =>
  {
    const camera_controller = controller();

    camera_controller.set_rotation(30, 270);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(30, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(270, 6);
  });

  it('reports the same angles for q and -q, which are the same rotation', () =>
  {
    const camera_controller = controller();
    const q = camera_controller.build_rotation(-20, 60);
    const negated = new Quaternion(-q.x, -q.y, -q.z, -q.w);

    camera_controller.set_quaternion(negated);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(-20, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(60, 6);
  });
});

describe('CameraController.set_rotation_delta', () =>
{
  it('adds the deltas to the current angles', () =>
  {
    const camera_controller = controller();
    camera_controller.set_rotation(10, 20);

    camera_controller.set_rotation_delta(5, 30);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(15, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(50, 6);
  });
});

describe('CameraController lerps', () =>
{
  it('lerp_tilt interpolates the tilt and keeps the orientation', () =>
  {
    const camera_controller = controller();
    camera_controller.set_rotation(0, 30);

    camera_controller.lerp_tilt(0, 60, 0.5);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(30, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(30, 6);
  });

  it('lerp_orientation interpolates the orientation and keeps the tilt', () =>
  {
    const camera_controller = controller();
    camera_controller.set_rotation(20, 0);

    camera_controller.lerp_orientation(0, 90, 0.5);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(20, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(45, 6);
  });

  it('lerp_rotation reaches the target at t = 1 and stays at the start at t = 0', () =>
  {
    const camera_controller = controller();

    camera_controller.lerp_rotation(10, 40, 20, 80, 0, 0, 0);
    expect(camera_controller.get_current_tilt()).toBeCloseTo(10, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(20, 6);

    camera_controller.lerp_rotation(10, 40, 20, 80, 0, 0, 1);
    expect(camera_controller.get_current_tilt()).toBeCloseTo(40, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(80, 6);
  });

  it('lerp_quaternion slerps from the current rotation towards the target', () =>
  {
    const camera_controller = controller();
    camera_controller.set_rotation(0, 0);

    camera_controller.lerp_quaternion(camera_controller.build_rotation(0, 90), 0.5);

    expect(camera_controller.get_current_orientation()).toBeCloseTo(45, 6);
  });

  it('lerp_azimuth does nothing yet', () =>
  {
    const camera_controller = controller();
    camera_controller.set_rotation(10, 20, 30);

    camera_controller.lerp_azimuth(0, 90, 1);

    expect(camera_controller.get_current_tilt()).toBeCloseTo(10, 6);
    expect(camera_controller.get_current_orientation()).toBeCloseTo(20, 6);
    expect(camera_controller.get_current_azimuth()).toBe(30);
  });
});
