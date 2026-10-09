import { beforeEach, describe, expect, it } from 'vitest';
import { Box3, Object3D, OrthographicCamera, PerspectiveCamera, Plane, Ray, Vector2, Vector3 } from 'three';
import type { Camera } from 'three';
import { CameraManager } from '../../src/CameraManager';
import { OScreen } from '../../src/OScreen';
import { CameraUtilities } from '../../src/utilities/CameraUtilities';

const input = { NDC: new Vector2() };

function perspective_camera()
{
  const camera = new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 1000);
  camera.position.set(0, 0, 20);
  camera.updateMatrixWorld(true);
  return camera;
}

// A 16 x 9 world unit frustum: not sized in pixels on purpose.
function orthographic_camera(half_width = 8, half_height = 4.5)
{
  const camera = new OrthographicCamera(-half_width, half_width, half_height, -half_height, 0.1, 1000);
  camera.position.set(0, 0, 20);
  camera.updateMatrixWorld(true);
  return camera;
}

function look_from(camera: Camera, position: Vector3, target: Vector3)
{
  camera.position.copy(position);
  camera.lookAt(target);
  camera.updateMatrixWorld(true);
}

// Applies a fit_points result to a copy of the camera and returns the NDC of
// the points as that camera sees them.
function ndc_after_fit(camera: Camera, result: { zoom: number, camera_position: Vector3 }, points: Vector3[])
{
  const fitted = camera.clone();
  fitted.position.copy(result.camera_position);
  if ((fitted as OrthographicCamera).isOrthographicCamera)
  {
    (fitted as OrthographicCamera).zoom = result.zoom;
    (fitted as OrthographicCamera).updateProjectionMatrix();
  }
  fitted.updateMatrixWorld(true);
  return points.map(p => p.clone().project(fitted));
}

function expect_framed(ndc: Vector3[])
{
  let edge = 0;
  for (const p of ndc)
  {
    expect(Math.abs(p.x)).toBeLessThanOrEqual(1 + 1e-6);
    expect(Math.abs(p.y)).toBeLessThanOrEqual(1 + 1e-6);
    expect(Math.abs(p.z)).toBeLessThanOrEqual(1 + 1e-6);
    edge = Math.max(edge, Math.abs(p.x), Math.abs(p.y));
  }
  return edge;
}

function box_corners(box: Box3)
{
  const corners = [];
  for (const x of [box.min.x, box.max.x])
  {
    for (const y of [box.min.y, box.max.y])
    {
      for (const z of [box.min.z, box.max.z])
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
  CameraManager.init();
  input.NDC.set(0, 0);
  CameraUtilities.init(input as never);
});

describe('CameraUtilities directions', () =>
{
  it('returns the camera up, forward and right directions', () =>
  {
    const camera = perspective_camera();
    camera.rotation.set(0, Math.PI / 2, 0);

    const up = CameraUtilities.get_up_dir(camera);
    const forward = CameraUtilities.get_forward_dir(camera);
    const right = CameraUtilities.get_right_dir(camera);

    expect(up.distanceTo(new Vector3(0, 1, 0))).toBeCloseTo(0, 6);
    expect(forward.distanceTo(new Vector3(-1, 0, 0))).toBeCloseTo(0, 6);
    expect(right.distanceTo(new Vector3(0, 0, -1))).toBeCloseTo(0, 6);
  });

  it('uses the current camera when none is given', () =>
  {
    const camera = perspective_camera();
    camera.rotation.set(-Math.PI / 2, 0, 0);
    CameraManager.current = camera as never;

    expect(CameraUtilities.get_forward_dir(undefined).distanceTo(new Vector3(0, -1, 0))).toBeCloseTo(0, 6);
  });
});

describe('CameraUtilities.unproject_mouse_position', () =>
{
  it('returns the view ray direction through an NDC point', () =>
  {
    const camera = perspective_camera();
    look_from(camera, new Vector3(3, 4, 5), new Vector3(0, 0, 0));
    const ndc = new Vector2(0.4, -0.7);

    const direction = CameraUtilities.unproject_mouse_position(ndc as never, camera as never);

    const expected = new Vector3(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize();
    expect(direction.distanceTo(expected)).toBeCloseTo(0, 6);
  });
});

describe('CameraUtilities.get_plane_intersection', () =>
{
  it('intersects the perspective view ray with a plane', () =>
  {
    const camera = perspective_camera();
    const ndc = new Vector2(0.5, 0.25);

    const point = CameraUtilities.get_plane_intersection(new Vector3(0, 0, 0), new Vector3(0, 0, 1), ndc as never, camera);

    const expected = new Vector3(ndc.x, ndc.y, 0.5).unproject(camera);
    expected.sub(camera.position).multiplyScalar(20 / -expected.z).add(camera.position);
    expect(point.z).toBeCloseTo(0, 6);
    expect(point.distanceTo(expected)).toBeCloseTo(0, 6);
  });

  it('intersects the orthographic view ray with a plane', () =>
  {
    const camera = orthographic_camera();

    const point = CameraUtilities.get_plane_intersection(new Vector3(0, 0, 0), new Vector3(0, 0, 1), new Vector2(1, 1) as never, camera);

    expect(point.toArray()).toEqual([8, 4.5, 0]);
  });

  it('takes the orthographic zoom into account', () =>
  {
    const camera = orthographic_camera();
    camera.zoom = 2;
    camera.updateProjectionMatrix();
    const ndc = new Vector2(1, -0.5);

    const point = CameraUtilities.get_plane_intersection(new Vector3(0, 0, 0), new Vector3(0, 0, 1), ndc as never, camera);

    const expected = new Vector3(ndc.x, ndc.y, 0).unproject(camera).setZ(0);
    expect(point.distanceTo(expected)).toBeCloseTo(0, 6);
  });

  it('takes an off center orthographic frustum into account', () =>
  {
    const camera = new OrthographicCamera(0, 16, 9, 0, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.updateMatrixWorld(true);

    const point = CameraUtilities.get_plane_intersection(new Vector3(0, 0, 0), new Vector3(0, 0, 1), new Vector2(0, 0) as never, camera);

    expect(point.toArray()).toEqual([8, 4.5, 0]);
  });

  it('defaults to a plane facing an orthographic camera', () =>
  {
    const camera = orthographic_camera();
    camera.zoom = 2;
    camera.updateProjectionMatrix();
    look_from(camera, new Vector3(5, 20, 3), new Vector3(0, 0, 0));
    const ndc = new Vector2(0.5, -0.5);
    const plane_position = new Vector3(0, -3, 0);

    const point = CameraUtilities.get_plane_intersection(plane_position, undefined, ndc as never, camera);

    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const origin = new Vector3(ndc.x, ndc.y, -1).unproject(camera);
    const expected = new Vector3();
    new Ray(origin, forward).intersectPlane(new Plane().setFromNormalAndCoplanarPoint(forward, plane_position), expected);
    expect(point.distanceTo(expected)).toBeCloseTo(0, 6);
  });

  it('defaults to the input NDC, the current camera and a plane facing it', () =>
  {
    const camera = perspective_camera();
    CameraManager.current = camera as never;
    input.NDC.set(0, 0);

    const point = CameraUtilities.get_plane_intersection(new Vector3(0, 0, -5), undefined);

    expect(point.distanceTo(new Vector3(0, 0, -5))).toBeCloseTo(0, 6);
  });
});

describe('CameraUtilities screen positions', () =>
{
  it('get_html_screen_pos returns the object position in CSS pixels from the top left', () =>
  {
    const camera = orthographic_camera();
    const object = new Object3D();
    object.position.set(-8, 4.5, 0);
    object.updateMatrixWorld(true);

    const pos = CameraUtilities.get_html_screen_pos(object, camera);

    expect(pos.x).toBeCloseTo(0, 6);
    expect(pos.y).toBeCloseTo(0, 6);
  });

  it('world_pos_to_screen returns a world position in CSS pixels from the top left', () =>
  {
    const camera = orthographic_camera();

    const pos = CameraUtilities.world_pos_to_screen(new Vector3(4, -2.25, 0), camera);

    expect(pos.x).toBeCloseTo(1200, 6);
    expect(pos.y).toBeCloseTo(675, 6);
  });
});

describe('CameraUtilities.update_projection', () =>
{
  it('sizes an orthographic frustum in screen pixels', () =>
  {
    const camera = orthographic_camera();

    CameraUtilities.update_projection(camera);

    expect([camera.left, camera.right, camera.top, camera.bottom]).toEqual([-800, 800, 450, -450]);
    expect(new Vector3(800, 450, 0).project(camera).x).toBeCloseTo(1, 6);
  });
});

describe('CameraUtilities.fit_points, perspective camera', () =>
{
  it('frames every point and fills the view', () =>
  {
    const camera = perspective_camera();
    look_from(camera, new Vector3(5, 8, 12), new Vector3(0, 0, 0));

    const result = CameraUtilities.fit_points(camera, cloud);

    expect(expect_framed(ndc_after_fit(camera, result, cloud))).toBeGreaterThan(0.95);
    expect(result.camera_position.distanceTo(result.reference_position)).toBeCloseTo(result.zoom, 6);
  });

  it('frames for the camera aspect, not the screen aspect', () =>
  {
    const camera = perspective_camera();
    camera.aspect = 1;
    camera.updateProjectionMatrix();

    const result = CameraUtilities.fit_points(camera, cloud);

    expect(expect_framed(ndc_after_fit(camera, result, cloud))).toBeGreaterThan(0.95);
  });

  it('fit_bounding_box_points frames the box corners', () =>
  {
    const camera = perspective_camera();
    const box = new Box3(new Vector3(-1, -2, -3), new Vector3(3, 2, 1));

    const result = CameraUtilities.fit_bounding_box_points(camera, box);

    expect(expect_framed(ndc_after_fit(camera, result, box_corners(box)))).toBeGreaterThan(0.95);
  });
});

describe('CameraUtilities.fit_points, orthographic camera', () =>
{
  it('returns the camera zoom that makes the points fill the view', () =>
  {
    const camera = orthographic_camera();

    const result = CameraUtilities.fit_points(camera, cloud);

    // The cloud is 4 x 1 across the view: 16 / 4 = 4 is tighter than 9 / 1.
    expect(result.zoom).toBeCloseTo(4, 6);
    expect(result.reference_position.length()).toBeCloseTo(0, 6);
    expect(expect_framed(ndc_after_fit(camera, result, cloud))).toBeCloseTo(1, 6);
  });

  it('keeps the camera distance to the points', () =>
  {
    const camera = orthographic_camera();

    const result = CameraUtilities.fit_points(camera, cloud);

    expect(result.camera_position.distanceTo(new Vector3(0, 0, 20))).toBeCloseTo(0, 6);
  });

  it('moves the camera so deep point sets stay between the near and far planes', () =>
  {
    const camera = orthographic_camera();
    camera.far = 100;
    camera.position.set(0, 0, 95);
    const deep = [new Vector3(0, 0, -30), new Vector3(1, 1, 30)];

    const result = CameraUtilities.fit_points(camera, deep);

    expect(result.camera_position.z).toBeCloseTo(70, 6);
    expect_framed(ndc_after_fit(camera, result, deep));
  });

  it('honours the camera rotation', () =>
  {
    const camera = orthographic_camera();
    look_from(camera, new Vector3(0, 20, 0), new Vector3(0, 0, 0)); // looking straight down
    const ground = [new Vector3(-4, 0, -1), new Vector3(4, 0, 1)];

    const result = CameraUtilities.fit_points(camera, ground);

    // 8 x 2 on the ground: 16 / 8 = 2 is tighter than 9 / 2.
    expect(result.zoom).toBeCloseTo(2, 6);
    expect(expect_framed(ndc_after_fit(camera, result, ground))).toBeCloseTo(1, 6);
  });

  it('multiplies the zoom by zoom_scale', () =>
  {
    const camera = orthographic_camera();

    expect(CameraUtilities.fit_points(camera, cloud, 0.5).zoom).toBeCloseTo(2, 6);
  });

  it('changes nothing on the camera', () =>
  {
    const camera = orthographic_camera();

    CameraUtilities.fit_points(camera, cloud);

    expect(camera.zoom).toBe(1);
    expect(camera.position.toArray()).toEqual([0, 0, 20]);
  });

  it('keeps the zoom for a single point, whatever the zoom_scale', () =>
  {
    const camera = orthographic_camera();

    expect(CameraUtilities.fit_points(camera, [new Vector3(1, 2, 3)]).zoom).toBe(1);
    expect(CameraUtilities.fit_points(camera, [new Vector3(1, 2, 3)], 3).zoom).toBe(1);
  });

  it('fit_bounding_box_points frames the box corners', () =>
  {
    const camera = orthographic_camera();
    look_from(camera, new Vector3(10, 12, 15), new Vector3(0, 0, 0));
    const box = new Box3(new Vector3(-1, -2, -3), new Vector3(3, 2, 1));

    const result = CameraUtilities.fit_bounding_box_points(camera, box);

    expect(expect_framed(ndc_after_fit(camera, result, box_corners(box)))).toBeCloseTo(1, 6);
  });
});

describe('CameraUtilities.get_zoom_to_fit_box', () =>
{
  it('returns the perspective distance that frames the box', () =>
  {
    const camera = perspective_camera();
    const box = new Box3(new Vector3(-2, -1, 0), new Vector3(2, 1, 0));

    const zoom = CameraUtilities.get_zoom_to_fit_box(box, camera);

    // A flat 4 x 2 box at 16:9: the 2 unit half width is the tighter one.
    const h_fov = Math.atan(Math.tan(Math.PI / 6) * 16 / 9);
    expect(zoom).toBeCloseTo(2 / Math.tan(h_fov), 3);
  });

  it('uses the current camera when none is given', () =>
  {
    const camera = orthographic_camera();
    CameraManager.current = camera as never;
    const box = new Box3(new Vector3(-2, -0.5, 0), new Vector3(2, 0.5, 0));

    expect(CameraUtilities.get_zoom_to_fit_box(box, undefined)).toBeCloseTo(4, 6);
  });

  it('returns 0 for an empty box on a perspective camera, as before', () =>
  {
    expect(CameraUtilities.get_zoom_to_fit_box(new Box3(), perspective_camera())).toBe(0);
  });

  it('keeps the zoom for an empty box on an orthographic camera', () =>
  {
    expect(CameraUtilities.get_zoom_to_fit_box(new Box3(), orthographic_camera())).toBe(1);
  });

  it('gives the same orthographic zoom as before for a pixel sized frustum', () =>
  {
    const camera = orthographic_camera(800, 450);
    const box = new Box3(new Vector3(-50, -20, -5), new Vector3(150, 80, 5));

    const zoom = CameraUtilities.get_zoom_to_fit_box(box, camera);

    // The old formula: min(screen width / box width, screen height / box height).
    expect(zoom).toBeCloseTo(Math.min(1600 / 200, 900 / 100), 6);
  });

  it('returns the orthographic zoom for any frustum and rotation', () =>
  {
    const camera = orthographic_camera();
    look_from(camera, new Vector3(0, 20, 0), new Vector3(0, 0, 0)); // looking straight down
    const box = new Box3(new Vector3(-4, -10, -1), new Vector3(4, 10, 1));

    // 8 x 2 on the ground; the 20 unit height is depth.
    expect(CameraUtilities.get_zoom_to_fit_box(box, camera)).toBeCloseTo(2, 6);
  });
});

describe('CameraUtilities.get_zoom_to_fit_rect', () =>
{
  it('returns the perspective distance that fits a half width and half height', () =>
  {
    CameraManager.current = perspective_camera() as never;

    // 16:9, so the vertical field of view is the tighter one.
    expect(CameraUtilities.get_zoom_to_fit_rect(1, 4)).toBeCloseTo(4 / Math.tan(Math.PI / 6), 6);
  });

  it('returns the orthographic zoom that fits a half width and half height', () =>
  {
    CameraManager.current = orthographic_camera() as never;

    // A 4 x 2 rect: 16 / 4 = 4 is tighter than 9 / 2.
    expect(CameraUtilities.get_zoom_to_fit_rect(2, 1)).toBeCloseTo(4, 6);
  });
});

describe('CameraUtilities.fit_points_on_camera', () =>
{
  it('returns the perspective distance for the points flattened onto the view plane', () =>
  {
    CameraManager.current = perspective_camera() as never;

    const result = CameraUtilities.fit_points_on_camera(cloud);

    // 4 x 1 across the view: the 2 unit half width is the tighter one at 16:9.
    const h_fov = Math.atan(Math.tan(Math.PI / 6) * 16 / 9);
    expect(result.zoom).toBeCloseTo(2 / Math.tan(h_fov), 6);
    expect(result.position.length()).toBeCloseTo(0, 6);
  });

  it('scales the area to fit by zoom_scale', () =>
  {
    CameraManager.current = orthographic_camera() as never;

    expect(CameraUtilities.fit_points_on_camera(cloud, 2).zoom).toBeCloseTo(2, 6);
  });

  it('returns the orthographic zoom for the points', () =>
  {
    CameraManager.current = orthographic_camera() as never;

    expect(CameraUtilities.fit_points_on_camera(cloud).zoom).toBeCloseTo(4, 6);
  });

  it('centers on the points as the rotated camera sees them', () =>
  {
    const camera = orthographic_camera();
    look_from(camera, new Vector3(20, 0, 20), new Vector3(0, 0, 0));
    CameraManager.current = camera as never;
    const points = [new Vector3(0, 0, 0), new Vector3(4, 0, 0), new Vector3(0, 0, -4), new Vector3(0, 2, 0)];

    const result = CameraUtilities.fit_points_on_camera(points);

    const fitted = camera.clone();
    fitted.position.copy(result.position).add(CameraUtilities.get_forward_dir(camera).multiplyScalar(-20));
    fitted.zoom = result.zoom;
    fitted.updateProjectionMatrix();
    fitted.updateMatrixWorld(true);
    const ndc = points.map(p => p.clone().project(fitted));
    const xs = ndc.map(p => p.x);
    const ys = ndc.map(p => p.y);
    expect(Math.min(...xs)).toBeCloseTo(-Math.max(...xs), 6);
    expect(Math.min(...ys)).toBeCloseTo(-Math.max(...ys), 6);
  });
});
