import { Scene } from 'three';

class SceneManager
{
  constructor()
  {
    this._current = new Scene();
    this._current.name = 'default_scene';
  }

  add_scene(name)
  {

  }

  get current()
  {
    return this._current;
  }

  set current(scene)
  {
    this._current = scene;
  }
}

export default new SceneManager();
