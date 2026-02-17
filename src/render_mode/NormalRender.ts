import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { SceneManager } from '../SceneManager';
import { BaseRender } from '../render_mode/BaseRender';

class NormalRender extends BaseRender
{
  constructor()
  {
    super();
  }

  render()
  {
    Graphics.clear(undefined, CameraManager.current, true, true);

    SceneManager.current.on_pre_render();

    SceneManager.current.render();

    SceneManager.current.on_post_render();
  }
}

export { NormalRender };
