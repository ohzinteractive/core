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

  get current()
  {
    return this._current;
  }

  set spectator(camera)
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
