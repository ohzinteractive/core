import { describe, expect, it } from 'vitest';
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
