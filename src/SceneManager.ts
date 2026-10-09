import type { Mesh } from 'three';
import type { AbstractScene } from './scenes/AbstractScene';

class SceneManager
{
  _current: AbstractScene;

  init(default_scene: AbstractScene): void
  {
    this._current = default_scene;
  }

  add_scene(name: string): void 
  {

  }

  get current()
  {
    return this._current;
  }
  
  set current(scene: AbstractScene)
  {
    this._current = scene;
  }

  dispose(): void
  {
    this.current.traverse((child: Mesh) => {
      if (child.geometry)
      {
        child.geometry.dispose();
        const mat = child.material;
        
        if (Array.isArray(mat)) {
          mat.forEach(m => m.dispose());
        } else {
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
