import { describe, expect, it } from 'vitest';
import { CameraBridge } from '../../src/dev_bridge/CameraBridge';

function make_camera()
{
  return {
    position: { x: 0, y: 0, z: 10 },
    fov: 60,
    near: 0.1,
    far: 200,
    clear_color: { getHexString: () => '181818' },
    clear_alpha: 1,
    projection_updates: 0,
    updateProjectionMatrix()
    {
      this.projection_updates++;
    }
  };
}

function make_controller()
{
  return {
    current_tilt: 30,
    current_orientation: 45,
    current_azimuth: 0,
    normalized_zoom: 0.5,
    min_zoom: 1,
    max_zoom: 40,
    reference_position: { x: 0, y: 0, z: 0 },
    quaternions: [] as unknown[],
    focused: [] as unknown[],
    get_current_tilt() { return this.current_tilt; },
    get_current_orientation() { return this.current_orientation; },
    get_current_azimuth() { return this.current_azimuth; },
    set_normalized_zoom(zoom: number) { this.normalized_zoom = Math.min(1, Math.max(0, zoom)); },
    build_rotation(tilt: number, orientation: number) { return { tilt, orientation }; },
    set_quaternion(q: unknown) { this.quaternions.push(q); },
    focus_on_bounding_box(box: unknown, scale?: number) { this.focused.push({ box, scale }); }
  };
}

const bridge = new CameraBridge();

describe('CameraBridge get', () =>
{
  it('reports the camera transform and projection', () =>
  {
    const state = bridge.get(make_camera(), make_controller());

    expect(state.position).toEqual([0, 0, 10]);
    expect(state.fov).toBe(60);
    expect(state.near).toBe(0.1);
    expect(state.far).toBe(200);
    expect(state.clear_color).toBe('#181818');
  });

  it('reports the orbital controller state in degrees', () =>
  {
    const state = bridge.get(make_camera(), make_controller());

    expect(state.controller).toEqual({
      tilt: 30,
      orientation: 45,
      azimuth: 0,
      zoom: 0.5,
      min_zoom: 1,
      max_zoom: 40,
      target: [0, 0, 0]
    });
  });

  it('reports a null controller when the scene has none', () =>
  {
    const state = bridge.get(make_camera(), null);

    expect(state.controller).toBeNull();
  });

  it('throws no_camera when no camera is active', () =>
  {
    expect(() => bridge.get(null as never, null)).toThrowError(
      expect.objectContaining({ code: 'no_camera' })
    );
  });
});

describe('CameraBridge set orbital', () =>
{
  it('applies tilt and orientation and rebuilds the quaternion', () =>
  {
    const controller = make_controller();
    const state = bridge.set(make_camera(), controller, { tilt: 70, orientation: 27 });

    expect(controller.current_tilt).toBe(70);
    expect(controller.current_orientation).toBe(27);
    expect(controller.quaternions).toEqual([{ tilt: 70, orientation: 27 }]);
    expect(state.controller?.tilt).toBe(70);
  });

  it('can set an angle to zero, which set_rotation cannot', () =>
  {
    const controller = make_controller();

    bridge.set(make_camera(), controller, { tilt: 0, orientation: 0 });

    expect(controller.current_tilt).toBe(0);
    expect(controller.current_orientation).toBe(0);
  });

  it('leaves angles the caller omitted untouched', () =>
  {
    const controller = make_controller();

    bridge.set(make_camera(), controller, { tilt: 12 });

    expect(controller.current_tilt).toBe(12);
    expect(controller.current_orientation).toBe(45);
  });

  it('clamps zoom to 0..1', () =>
  {
    const controller = make_controller();

    bridge.set(make_camera(), controller, { zoom: 5 });

    expect(controller.normalized_zoom).toBe(1);
  });

  it('moves the orbit target', () =>
  {
    const controller = make_controller();

    bridge.set(make_camera(), controller, { target: [1, 2, 3] });

    expect(controller.reference_position).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('reports which fields changed', () =>
  {
    const state = bridge.set(make_camera(), make_controller(), { tilt: 70, zoom: 0.2 });

    expect(state.changed).toEqual(['tilt', 'zoom']);
  });

  it('ignores non-numeric values arriving off the wire', () =>
  {
    const controller = make_controller();
    const state = bridge.set(make_camera(), controller, { tilt: 'high' as never, zoom: null as never });

    expect(controller.current_tilt).toBe(30);
    expect(state.changed).toEqual([]);
  });
});

describe('CameraBridge set projection', () =>
{
  it('applies fov and refreshes the projection matrix', () =>
  {
    const camera = make_camera();
    const state = bridge.set(camera, make_controller(), { fov: 35 });

    expect(camera.fov).toBe(35);
    expect(camera.projection_updates).toBe(1);
    expect(state.changed).toEqual(['fov']);
  });
});

describe('CameraBridge raw position', () =>
{
  it('refuses a raw position while a controller owns the camera', () =>
  {
    expect(() => bridge.set(make_camera(), make_controller(), { position: [1, 2, 3] })).toThrowError(
      expect.objectContaining({ code: 'controller_owns_camera' })
    );
  });

  it('allows a raw position when no controller is present', () =>
  {
    const camera = make_camera();
    const state = bridge.set(camera, null, { position: [1, 2, 3] });

    expect(camera.position).toEqual({ x: 1, y: 2, z: 3 });
    expect(state.changed).toEqual(['position']);
  });
});

describe('CameraBridge frame', () =>
{
  it('focuses the controller on the bounds of the target object', () =>
  {
    const controller = make_controller();
    const scene = { uuid: 'root', name: 'scene', children: [{ uuid: 'u-cube', name: 'cube', children: [] }] };

    bridge.frame(make_camera(), controller, scene, { name: 'cube', scale: 1.5 }, (object) => ({ of: object }));

    expect(controller.focused).toHaveLength(1);
    expect(controller.focused[0]).toEqual({ box: { of: scene.children[0] }, scale: 1.5 });
  });

  it('throws not_found for an unknown object', () =>
  {
    const scene = { uuid: 'root', name: 'scene', children: [] };

    expect(() => bridge.frame(make_camera(), make_controller(), scene, { name: 'ghost' }, () => ({}))).toThrowError(
      expect.objectContaining({ code: 'not_found' })
    );
  });

  it('throws no_controller when the scene has no camera controller', () =>
  {
    const scene = { uuid: 'root', name: 'scene', children: [{ uuid: 'u-cube', name: 'cube', children: [] }] };

    expect(() => bridge.frame(make_camera(), null, scene, { name: 'cube' }, () => ({}))).toThrowError(
      expect.objectContaining({ code: 'no_controller' })
    );
  });
});
