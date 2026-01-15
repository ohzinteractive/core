import { PerspectiveCamera } from './PerspectiveCamera';

class CameraManager
{
  _current: PerspectiveCamera;
  _spectator: PerspectiveCamera;

  init(): void
  {
    this._current = undefined;
    // VR Spectator
    this._spectator = undefined;
  }

  set current(camera: PerspectiveCamera)
  {
    this._current = camera;
  }

  /** @type {PerspectiveCamera} */
  get current()
  {
    return this._current;
  }

  set spectator(camera: PerspectiveCamera)
  {
    this._spectator = camera;
  }

  /** @type {PerspectiveCamera} */
  get spectator()
  {
    return this._spectator;
  }
}

const camera_manager = new CameraManager();
export { camera_manager as CameraManager };
