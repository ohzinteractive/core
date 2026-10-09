import { beforeEach, describe, expect, it } from 'vitest';
import { Box3, OrthographicCamera, PerspectiveCamera, Quaternion, Sphere, Vector3 } from 'three';
import { CameraController } from '../../src/camera_controller/CameraController';
import { ImmediateMode } from '../../src/camera_controller/movement_mode/ImmediateMode';
import { OScreen } from '../../src/OScreen';

// Framing is checked the way it is seen: place the camera like the default
// ImmediateMode does, project the points, and look at their NDC.

function perspective_controller()
{
  const camera_controller = new CameraController({} as never);
  camera_controller.set_camera(new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 1000));
  return camera_controller;
}

// A 16 x 9 world unit frustum: not sized in pixels on purpose.
function orthographic_controller(half_width = 8, half_height = 4.5)
{
  const camera_controller = new CameraController({} as never);
  camera_controller.set_camera(new OrthographicCamera(-half_width, half_width, half_height, -half_height, 0.1, 1000));
  return camera_controller;
}

function place(camera_controller: CameraController)
{
  new ImmediateMode().update(camera_controller);
  camera_controller.camera.updateMatrixWorld(true);
}

function ndc_of(camera_controller: CameraController, points: Vector3[])
{
  place(camera_controller);
  return points.map(p => p.clone().project(camera_controller.camera));
}

function expect_framed(camera_controller: CameraController, points: Vector3[])
{
  const ndc = ndc_of(camera_controller, points);
  let edge = 0;
  for (const p of ndc)
  {
    expect(Math.abs(p.x)).toBeLessThanOrEqual(1 + 1e-6);
    expect(Math.abs(p.y)).toBeLessThanOrEqual(1 + 1e-6);
    // Between the near and far planes.
    expect(Math.abs(p.z)).toBeLessThanOrEqual(1 + 1e-6);
    edge = Math.max(edge, Math.abs(p.x), Math.abs(p.y));
  }
  return edge;
}

function box_corners(min: Vector3, max: Vector3)
{
  const corners = [];
  for (const x of [min.x, max.x])
  {
    for (const y of [min.y, max.y])
    {
      for (const z of [min.z, max.z])
      {
        corners.push(new Vector3(x, y, z));
      }
    }
  }
  return corners;
}

const cloud = [
  new Vector3(-2, -0.5, 0),
  new Vector3(2, 0.5, 0),
  new Vector3(1, -0.5, 0.5),
  new Vector3(-1, 0.5, -0.5)
];

beforeEach(() =>
{
  OScreen.init();
  OScreen.update_size(1600, 900);
});

describe('CameraController framing, perspective camera', () =>
{
  it('focus_camera_on_points frames every point and fills the view', () =>
  {
    const camera_controller = perspective_controller();
    camera_controller.set_rotation(30, 45);

    camera_controller.focus_camera_on_points(cloud);

    expect(expect_framed(camera_controller, cloud)).toBeGreaterThan(0.95);
  });

  it('fit_points returns what focus_camera_on_points applies, without applying it', () =>
  {
    const camera_controller = perspective_controller();
    camera_controller.set_rotation(30, 45);

    const result = camera_controller.fit_points(camera_controller.reference_rotation, cloud);

    expect(camera_controller.reference_zoom).toBe(10);
    expect(camera_controller.reference_position.equals(new Vector3())).toBe(true);

    camera_controller.focus_camera_on_points(cloud);
    expect(result.zoom).toBeCloseTo(camera_controller.reference_zoom, 6);
    expect(result.reference_position.distanceTo(camera_controller.reference_position)).toBeCloseTo(0, 6);

    const backward = new Vector3(0, 0, 1).applyQuaternion(camera_controller.reference_rotation);
    const expected_camera = result.reference_position.clone().addScaledVector(backward, result.zoom);
    expect(result.camera_position.distanceTo(expected_camera)).toBeCloseTo(0, 4);
  });

  it('get_zoom_to_focus_on_points and get_target_pos_to_focus_on_points leave the controller as it was', () =>
  {
    const camera_controller = perspective_controller();
    camera_controller.reference_position.set(7, 7, 7);
    camera_controller.reference_zoom = 33;

    const zoom = camera_controller.get_zoom_to_focus_on_points(cloud, 1);
    const target = camera_controller.get_target_pos_to_focus_on_points(cloud, 1);

    expect(camera_controller.reference_position.toArray()).toEqual([7, 7, 7]);
    expect(camera_controller.reference_zoom).toBe(33);

    camera_controller.focus_camera_on_points(cloud, 1);
    expect(zoom).toBeCloseTo(camera_controller.reference_zoom, 6);
    expect(target.distanceTo(camera_controller.reference_position)).toBeCloseTo(0, 6);
  });

  it('focus_on_bounding_box frames the box corners', () =>
  {
    const camera_controller = perspective_controller();
    camera_controller.set_rotation(20, 10);
    const box = new Box3(new Vector3(-1, -2, -3), new Vector3(3, 2, 1));

    camera_controller.focus_on_bounding_box(box);

    expect(expect_framed(camera_controller, box_corners(box.min, box.max))).toBeGreaterThan(0.95);
  });

  it('get_zoom_to_sphere returns the distance that fits the sphere in both directions', () =>
  {
    const camera_controller = perspective_controller();
    const sphere = new Sphere(new Vector3(), 2);

    const zoom = camera_controller.get_zoom_to_sphere(sphere as never, false);

    // 16:9, so the vertical field of view is the tighter one.
    expect(zoom).toBeCloseTo(2 / Math.tan(Math.PI / 6), 6);
  });

  it('focus_camera_on_sphere centers on the sphere at that distance', () =>
  {
    const camera_controller = perspective_controller();
    const sphere = new Sphere(new Vector3(1, 2, 3), 2);

    camera_controller.focus_camera_on_sphere(sphere as never, false);

    expect(camera_controller.reference_position.toArray()).toEqual([1, 2, 3]);
    expect(camera_controller.reference_zoom).toBeCloseTo(2 / Math.tan(Math.PI / 6), 6);
  });

  it('__get_zoom_to_show_rect fits a half width and half height', () =>
  {
    const camera_controller = perspective_controller();

    const zoom = camera_controller.__get_zoom_to_show_rect(1, 4);

    expect(zoom).toBeCloseTo(4 / Math.tan(Math.PI / 6), 6);
  });
});

describe('CameraController framing, orthographic camera', () =>
{
  it('focus_camera_on_points sets the camera zoom so the points fill the view', () =>
  {
    const camera_controller = orthographic_controller();

    camera_controller.focus_camera_on_points(cloud);

    // The cloud is 4 x 1 across the view: 16 / 4 = 4 is tighter than 9 / 1.
    expect((camera_controller.camera as OrthographicCamera).zoom).toBeCloseTo(4, 6);
    expect(expect_framed(camera_controller, cloud)).toBeCloseTo(1, 6);
  });

  it('focus_camera_on_points updates the projection matrix', () =>
  {
    const camera_controller = orthographic_controller();
    const before = camera_controller.camera.projectionMatrix.clone();

    camera_controller.focus_camera_on_points(cloud);

    expect(camera_controller.camera.projectionMatrix.equals(before)).toBe(false);
  });

  it('focus_camera_on_points centers on the points', () =>
  {
    const camera_controller = orthographic_controller();
    const moved = cloud.map(p => p.clone().add(new Vector3(10, 20, 30)));

    camera_controller.focus_camera_on_points(moved);

    expect(camera_controller.reference_position.x).toBeCloseTo(10, 6);
    expect(camera_controller.reference_position.y).toBeCloseTo(20, 6);
    expect(camera_controller.reference_position.z).toBeCloseTo(30, 6);
  });

  it('focus_camera_on_points honours the controller rotation', () =>
  {
    const camera_controller = orthographic_controller();
    camera_controller.set_rotation(90, 0); // looking straight down
    const ground = [new Vector3(-4, 0, -1), new Vector3(4, 0, 1)];

    camera_controller.focus_camera_on_points(ground);

    // 8 x 2 on the ground: 16 / 8 = 2 is tighter than 9 / 2.
    expect((camera_controller.camera as OrthographicCamera).zoom).toBeCloseTo(2, 6);
    expect(expect_framed(camera_controller, ground)).toBeCloseTo(1, 6);
  });

  it('focus_camera_on_points multiplies the zoom by zoom_scale', () =>
  {
    const camera_controller = orthographic_controller();

    camera_controller.focus_camera_on_points(cloud, 0.5);

    expect((camera_controller.camera as OrthographicCamera).zoom).toBeCloseTo(2, 6);
  });

  it('focus_camera_on_points keeps the distance when the points already fit in front of the camera', () =>
  {
    const camera_controller = orthographic_controller();

    camera_controller.focus_camera_on_points(cloud);

    expect(camera_controller.reference_zoom).toBe(10);
  });

  it('focus_camera_on_points backs the camera off so deep point sets stay in front of it', () =>
  {
    const camera_controller = orthographic_controller();
    const deep = [new Vector3(0, 0, -40), new Vector3(1, 1, 40)];

    camera_controller.focus_camera_on_points(deep);

    expect(camera_controller.reference_zoom).toBeGreaterThan(40);
    expect_framed(camera_controller, deep);
  });

  it('focus_camera_on_points brings the camera closer so deep point sets stay before the far plane', () =>
  {
    const camera_controller = orthographic_controller();
    camera_controller.camera.far = 100;
    camera_controller.reference_zoom = 90;
    const deep = [new Vector3(0, 0, -30), new Vector3(1, 1, 30)];

    camera_controller.focus_camera_on_points(deep);

    expect(camera_controller.reference_zoom).toBeCloseTo(70, 6);
    expect_framed(camera_controller, deep);
  });

  it('focus_camera_on_points keeps the zoom for a single point', () =>
  {
    const camera_controller = orthographic_controller();

    camera_controller.focus_camera_on_points([new Vector3(1, 2, 3)], 3);

    expect((camera_controller.camera as OrthographicCamera).zoom).toBe(1);
    expect(camera_controller.reference_position.toArray()).toEqual([1, 2, 3]);
  });

  it('focus_camera_on_points keeps the zoom for points lined up with the view direction', () =>
  {
    const camera_controller = orthographic_controller();
    camera_controller.set_rotation(37, 123);
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera_controller.reference_rotation);
    const line = [new Vector3(0.3, 0, 0.7), new Vector3(0.3, 0, 0.7).addScaledVector(forward, 5)];

    camera_controller.focus_camera_on_points(line);

    expect((camera_controller.camera as OrthographicCamera).zoom).toBe(1);
  });

  it('focus_camera_on_points fits the other axis for points lined up across the view', () =>
  {
    const camera_controller = orthographic_controller();
    camera_controller.set_rotation(90, 33); // looking straight down
    const right = new Vector3(1, 0, 0).applyQuaternion(camera_controller.reference_rotation);
    const line = [new Vector3(), right.clone().multiplyScalar(4)];

    camera_controller.focus_camera_on_points(line);

    expect((camera_controller.camera as OrthographicCamera).zoom).toBeCloseTo(4, 6);
  });

  it('fit_points returns the framing without applying it', () =>
  {
    const camera_controller = orthographic_controller();
    camera_controller.reference_position.set(7, 7, 7);
    const camera = camera_controller.camera as OrthographicCamera;

    const result = camera_controller.fit_points(camera_controller.reference_rotation, cloud);

    expect(result.zoom).toBeCloseTo(4, 6);
    expect(result.reference_position.length()).toBeCloseTo(0, 6);
    expect(result.camera_position.x).toBeCloseTo(0, 6);
    expect(result.camera_position.y).toBeCloseTo(0, 6);
    expect(result.camera_position.z).toBeCloseTo(10, 6);

    expect(camera.zoom).toBe(1);
    expect(camera_controller.reference_position.toArray()).toEqual([7, 7, 7]);
    expect(camera_controller.reference_zoom).toBe(10);
  });

  it('fit_points frames for the quaternion it is given, not the controller rotation', () =>
  {
    const camera_controller = orthographic_controller();
    const top_down = camera_controller.build_rotation(90, 0);
    const ground = [new Vector3(-4, 0, -1), new Vector3(4, 0, 1)];

    const result = camera_controller.fit_points(top_down, ground);

    expect(camera_controller.reference_rotation.equals(new Quaternion())).toBe(true);
    expect(result.zoom).toBeCloseTo(2, 6);
    expect(result.camera_position.x).toBeCloseTo(0, 6);
    expect(result.camera_position.y).toBeCloseTo(10, 6);
    expect(result.camera_position.z).toBeCloseTo(0, 6);
  });

  it('get_zoom_to_focus_on_points returns the camera zoom and changes nothing', () =>
  {
    const camera_controller = orthographic_controller();
    const camera = camera_controller.camera as OrthographicCamera;
    const projection = camera.projectionMatrix.clone();

    const zoom = camera_controller.get_zoom_to_focus_on_points(cloud, 1);

    expect(zoom).toBeCloseTo(4, 6);
    expect(camera.zoom).toBe(1);
    expect(camera.projectionMatrix.equals(projection)).toBe(true);
    expect(camera_controller.reference_zoom).toBe(10);
  });

  it('get_target_pos_to_focus_on_points returns the center and changes nothing', () =>
  {
    const camera_controller = orthographic_controller();
    const moved = cloud.map(p => p.clone().add(new Vector3(1, 2, 3)));

    const target = camera_controller.get_target_pos_to_focus_on_points(moved, 1);

    expect(target.distanceTo(new Vector3(1, 2, 3))).toBeCloseTo(0, 6);
    expect(camera_controller.reference_position.toArray()).toEqual([0, 0, 0]);
    expect((camera_controller.camera as OrthographicCamera).zoom).toBe(1);
  });

  it('focus_on_bounding_box gives the same zoom as before for a pixel sized frustum', () =>
  {
    const camera_controller = orthographic_controller(800, 450);
    const box = new Box3(new Vector3(-50, -20, -5), new Vector3(150, 80, 5));

    camera_controller.focus_on_bounding_box(box);

    // The old formula: min(screen width / box width, screen height / box height).
    expect((camera_controller.camera as OrthographicCamera).zoom).toBeCloseTo(Math.min(1600 / 200, 900 / 100), 6);
    expect(camera_controller.reference_position.x).toBeCloseTo(50, 6);
    expect(camera_controller.reference_position.y).toBeCloseTo(30, 6);
    expect(camera_controller.reference_position.z).toBeCloseTo(0, 6);
  });

  it('focus_on_bounding_box frames the box for any frustum and rotation, and applies scale', () =>
  {
    const camera_controller = orthographic_controller();
    camera_controller.set_rotation(35, 120);
    const box = new Box3(new Vector3(-1, -2, -3), new Vector3(3, 2, 1));

    camera_controller.focus_on_bounding_box(box);
    const zoom = (camera_controller.camera as OrthographicCamera).zoom;
    expect(expect_framed(camera_controller, box_corners(box.min, box.max))).toBeCloseTo(1, 6);

    camera_controller.focus_on_bounding_box(box, 0.5);
    expect((camera_controller.camera as OrthographicCamera).zoom).toBeCloseTo(zoom * 0.5, 6);
  });

  it('get_zoom_to_sphere returns the camera zoom that fits the sphere', () =>
  {
    const camera_controller = orthographic_controller();

    const zoom = camera_controller.get_zoom_to_sphere(new Sphere(new Vector3(), 2) as never, false);

    // A 4 unit diameter: 9 / 4 is tighter than 16 / 4.
    expect(zoom).toBeCloseTo(2.25, 6);
    expect((camera_controller.camera as OrthographicCamera).zoom).toBe(1);
  });

  it('focus_camera_on_sphere zooms the camera and centers on the sphere', () =>
  {
    const camera_controller = orthographic_controller();
    const sphere = new Sphere(new Vector3(1, 2, 3), 2);

    camera_controller.focus_camera_on_sphere(sphere as never, false);

    expect((camera_controller.camera as OrthographicCamera).zoom).toBeCloseTo(2.25, 6);
    expect(camera_controller.reference_position.toArray()).toEqual([1, 2, 3]);
    expect(camera_controller.reference_zoom).toBe(10);

    const top = new Vector3(1, 4, 3);
    expect(ndc_of(camera_controller, [top])[0].y).toBeCloseTo(1, 6);
  });

  it('focus_camera_on_sphere backs the camera off so the sphere stays in front of it', () =>
  {
    const camera_controller = orthographic_controller();

    camera_controller.focus_camera_on_sphere(new Sphere(new Vector3(), 30) as never, false);

    expect(camera_controller.reference_zoom).toBeCloseTo(30.1, 6);
  });

  it('__get_zoom_to_show_rect returns the camera zoom that fits a half width and half height', () =>
  {
    const camera_controller = orthographic_controller();

    // A 4 x 2 rect: 16 / 4 = 4 is tighter than 9 / 2.
    expect(camera_controller.__get_zoom_to_show_rect(2, 1)).toBeCloseTo(4, 6);
    expect(camera_controller.__get_zoom_to_show_rect(2, 1, 2)).toBeCloseTo(8, 6);
  });
});
