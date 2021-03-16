class CameraManager
{
  init()
  {
    this._current = undefined;
  }

  set current(camera)
  {
    this._current = camera;
  }

  get current()
  {
    return this._current;
  }
}

export default new CameraManager();
