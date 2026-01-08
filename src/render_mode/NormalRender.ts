import { CameraManager } from '../CameraManager';
import { SceneManager } from '../SceneManager';
import { BaseRender } from '../render_mode/BaseRender';
import { Graphics } from '../Graphics';

class NormalRender extends BaseRender
{
  constructor()
  {
    super();
  }

  render()
  {
    Graphics.clear(undefined, CameraManager.current, true, true);

    if (SceneManager.current.on_pre_render)
    {
      SceneManager.current.on_pre_render();
    }

    if (SceneManager.current.render)
    {
      SceneManager.current.render();
    }
    else
    {
      Graphics.render(SceneManager.current, CameraManager.current);
    }

    if (SceneManager.current.on_post_render)
    {
      SceneManager.current.on_post_render();
    }
  }
}

export { NormalRender };
