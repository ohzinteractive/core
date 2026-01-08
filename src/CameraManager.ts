// @ts-check
import { PerspectiveCamera } from './PerspectiveCamera'; // eslint-disable-line no-unused-vars

class CameraManager
{
  init()
  {
    this._current = undefined;
    // VR Spectator
    this._spectator = undefined;
  }

  set current(camera)
  {
    this._current = camera;
  }

  /** @type {PerspectiveCamera} */
  get current()
  {
    return this._current;
  }

  set spectator(camera)
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
