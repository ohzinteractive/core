import type { InspectableObject } from './SceneInspector';

const PRECISION = 10000;

export interface OrbitalController
{
  current_tilt: number;
  current_orientation: number;
  current_azimuth: number;
  normalized_zoom: number;
  min_zoom: number;
  max_zoom: number;
  reference_position: { x: number; y: number; z: number };
  get_current_tilt(): number;
  get_current_orientation(): number;
  get_current_azimuth(): number;
  set_normalized_zoom(zoom: number): void;
  set_rotation(tilt?: number, orientation?: number, azimuth?: number): void;
  focus_on_bounding_box(box: unknown, scale?: number): void;
}

export interface BridgeCamera
{
  position: { x: number; y: number; z: number };
  fov?: number;
  near?: number;
  far?: number;
  clear_color?: { getHexString?: () => string };
  clear_alpha?: number;
  updateProjectionMatrix?: () => void;
}

export interface ControllerState
{
  tilt: number;
  orientation: number;
  azimuth: number;
  zoom: number;
  min_zoom: number;
  max_zoom: number;
  target: number[];
}

export interface CameraState
{
  position: number[];
  fov: number | null;
  near: number | null;
  far: number | null;
  clear_color: string | null;
  clear_alpha: number | null;
  controller: ControllerState | null;
  changed?: string[];
}

// Changes arrive off the dev-bridge wire and are therefore untrusted.
export interface CameraChanges
{
  tilt?: unknown;
  orientation?: unknown;
  azimuth?: unknown;
  zoom?: unknown;
  fov?: unknown;
  target?: unknown;
  position?: unknown;
}

export interface FrameRequest
{
  uuid?: unknown;
  name?: unknown;
  scale?: unknown;
}

// Speaks the CameraController's own idiom. The controller is orbital, driven by
// tilt, orientation, azimuth and a normalised zoom in degrees, and it rewrites
// the camera transform every update. Assigning camera.position directly while a
// controller is active would simply be overwritten on the next frame.
class CameraBridge
{
  get(camera: BridgeCamera, controller: OrbitalController | null): CameraState
  {
    return this.describe(this.require_camera(camera), controller);
  }

  set(camera: BridgeCamera, controller: OrbitalController | null, changes: CameraChanges): CameraState
  {
    const target_camera = this.require_camera(camera);
    const changed: string[] = [];

    if (controller !== null)
    {
      this.apply_orbit(controller, changes, changed);
    }

    this.apply_position(target_camera, controller, changes, changed);
    this.apply_fov(target_camera, changes, changed);

    const state = this.describe(target_camera, controller);
    state.changed = changed;

    return state;
  }

  frame(
    camera: BridgeCamera,
    controller: OrbitalController | null,
    root: InspectableObject,
    request: FrameRequest,
    make_bounds: (object: InspectableObject) => unknown
  ): CameraState
  {
    const target_camera = this.require_camera(camera);

    if (controller === null)
    {
      throw this.error('no_controller', 'The active scene has no camera_controller, so framing is unavailable.');
    }

    const uuid = typeof request.uuid === 'string' ? request.uuid : null;
    const name = typeof request.name === 'string' ? request.name : null;

    if (uuid === null && name === null)
    {
      throw this.error('not_found', 'Pass a uuid or a name to identify the object to frame.');
    }

    const found = this.find(root, uuid, name);

    if (found === null)
    {
      const label = uuid === null ? `name '${name === null ? '' : name}'` : `uuid '${uuid}'`;

      throw this.error('not_found', `No object matching ${label} in the current scene.`);
    }

    const scale = typeof request.scale === 'number' && Number.isFinite(request.scale) ? request.scale : 1;

    controller.focus_on_bounding_box(make_bounds(found), scale);

    const state = this.describe(target_camera, controller);
    state.changed = ['framed'];

    return state;
  }

  // Angles go through set_rotation, which is nullish-checked, so an omitted
  // value keeps the current angle and an explicit 0 is applied. It also records
  // old_orientation, which assigning the fields directly would skip.
  private apply_orbit(controller: OrbitalController, changes: CameraChanges, changed: string[]): void
  {
    const tilt = this.number(changes.tilt);
    const orientation = this.number(changes.orientation);
    const azimuth = this.number(changes.azimuth);

    if (tilt !== null || orientation !== null || azimuth !== null)
    {
      if (tilt !== null)
      {
        changed.push('tilt');
      }

      if (orientation !== null)
      {
        changed.push('orientation');
      }

      if (azimuth !== null)
      {
        changed.push('azimuth');
      }

      controller.set_rotation(
        tilt === null ? undefined : tilt,
        orientation === null ? undefined : orientation,
        azimuth === null ? undefined : azimuth
      );
    }

    const zoom = this.number(changes.zoom);

    if (zoom !== null)
    {
      controller.set_normalized_zoom(zoom);
      changed.push('zoom');
    }

    const target = this.triple(changes.target);

    if (target !== null)
    {
      controller.reference_position.x = target[0];
      controller.reference_position.y = target[1];
      controller.reference_position.z = target[2];
      changed.push('target');
    }
  }

  private apply_position(
    camera: BridgeCamera,
    controller: OrbitalController | null,
    changes: CameraChanges,
    changed: string[]
  ): void
  {
    const position = this.triple(changes.position);

    if (position === null)
    {
      return;
    }

    if (controller !== null)
    {
      throw this.error(
        'controller_owns_camera',
        'A CameraController is driving this camera and would overwrite a raw position on the next frame. Use tilt, orientation, azimuth, zoom and target instead.'
      );
    }

    camera.position.x = position[0];
    camera.position.y = position[1];
    camera.position.z = position[2];
    changed.push('position');
  }

  private apply_fov(camera: BridgeCamera, changes: CameraChanges, changed: string[]): void
  {
    const fov = this.number(changes.fov);

    if (fov === null)
    {
      return;
    }

    camera.fov = fov;
    changed.push('fov');

    if (typeof camera.updateProjectionMatrix === 'function')
    {
      camera.updateProjectionMatrix();
    }
  }

  private describe(camera: BridgeCamera, controller: OrbitalController | null): CameraState
  {
    return {
      position: [this.round(camera.position.x), this.round(camera.position.y), this.round(camera.position.z)],
      fov: typeof camera.fov === 'number' ? camera.fov : null,
      near: typeof camera.near === 'number' ? camera.near : null,
      far: typeof camera.far === 'number' ? camera.far : null,
      clear_color: this.hex(camera.clear_color),
      clear_alpha: typeof camera.clear_alpha === 'number' ? camera.clear_alpha : null,
      controller: controller === null ? null : {
        tilt: controller.get_current_tilt(),
        orientation: controller.get_current_orientation(),
        azimuth: controller.get_current_azimuth(),
        zoom: controller.normalized_zoom,
        min_zoom: controller.min_zoom,
        max_zoom: controller.max_zoom,
        target: [
          this.round(controller.reference_position.x),
          this.round(controller.reference_position.y),
          this.round(controller.reference_position.z)
        ]
      }
    };
  }

  private find(node: InspectableObject, uuid: string | null, name: string | null): InspectableObject | null
  {
    const matches = uuid !== null ? node.uuid === uuid : node.name === name;

    if (matches)
    {
      return node;
    }

    const children = Array.isArray(node.children) ? node.children : [];

    for (const child of children)
    {
      const found = this.find(child, uuid, name);

      if (found !== null)
      {
        return found;
      }
    }

    return null;
  }

  private require_camera(camera: BridgeCamera): BridgeCamera
  {
    if (typeof camera !== 'object' || camera === null || typeof camera.position !== 'object')
    {
      throw this.error('no_camera', 'No camera is active. CameraManager.current is not set yet.');
    }

    return camera;
  }

  private hex(color: { getHexString?: () => string } | undefined): string | null
  {
    if (typeof color !== 'object' || color === null || typeof color.getHexString !== 'function')
    {
      return null;
    }

    return `#${color.getHexString()}`;
  }

  private number(value: unknown): number | null
  {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private triple(value: unknown): number[] | null
  {
    if (!Array.isArray(value))
    {
      return null;
    }

    const supplied = value as unknown[];
    const out: number[] = [];

    for (let i = 0; i < 3; i++)
    {
      const entry = this.number(supplied[i]);

      if (entry === null)
      {
        return null;
      }

      out.push(entry);
    }

    return out;
  }

  private round(value: unknown): number
  {
    if (typeof value !== 'number' || !Number.isFinite(value))
    {
      return 0;
    }

    return Math.round(value * PRECISION) / PRECISION;
  }

  private error(code: string, message: string): Error
  {
    const error: Error & { code?: string } = new Error(message);
    error.code = code;

    return error;
  }
}

export { CameraBridge };
