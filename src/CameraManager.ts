import type { PerspectiveCamera } from './PerspectiveCamera';

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

  get current()
  {
    return this._current;
  }

  set spectator(camera: PerspectiveCamera)
  {
    this._spectator = camera;
  }

  get spectator()
  {
    return this._spectator;
  }
}

const camera_manager = new CameraManager();
export { camera_manager as CameraManager };
