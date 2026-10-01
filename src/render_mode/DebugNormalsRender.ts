import { CameraManager } from '../CameraManager';
import { SceneManager } from '../SceneManager';
import { BaseRender } from '../render_mode/BaseRender';
import { Graphics } from '../Graphics';
import { NormalMaterial } from '../materials/NormalMaterial';

class DebugNormalsRender extends BaseRender
{
  normal_material: NormalMaterial;

  constructor()
  {
    super();

    // Built once: node materials compile per instance, so a new one per frame recompiles every frame.
    this.normal_material = new NormalMaterial();
  }

  render()
  {
    Graphics.clear(undefined, CameraManager.current, true, true);

    Graphics.render(SceneManager.current, CameraManager.current, undefined, this.normal_material);
  }
}

export { DebugNormalsRender };
