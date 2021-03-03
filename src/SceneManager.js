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

  dispose()
  {
    this.current.traverse(child =>
    {
      if (child.geometry)
      {
        child.geometry.dispose();
        child.material.dispose();
      }
    });

    while (this.current.children.length > 0)
    {
      this.current.remove(this.current.children[0]);
    }
  }
}

export default new SceneManager();
