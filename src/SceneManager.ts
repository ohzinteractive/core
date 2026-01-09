import { Mesh, Scene } from 'three';

class SceneManager
{
  _current: any;
  init()
  {
    this._current = new Scene();
    this._current.name = 'default_scene';
  }

  /**
   * @param {string} name
   */
  add_scene(name: any) 
  {

  }

  /** @type {Scene} */
  
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
    this.current.traverse((/** @type {Mesh} */ child: any) => {
      if (child.geometry)
      {
        child.geometry.dispose();
        const mat = child.material;
        if ('disppose' in mat && typeof (mat.disppose) === 'function')
        {
          mat.dispose();
        }
      }
    });

    while (this.current.children.length > 0)
    {
      this.current.remove(this.current.children[0]);
    }
  }
}

const scene_manager = new SceneManager();
export { scene_manager as SceneManager };
