import CameraManager from '../CameraManager';
import SceneManager from '../SceneManager';
import BaseRender from '../render_mode/BaseRender';
import Graphics from '../Graphics';

export default class NormalRender extends BaseRender
{
  constructor()
  {
    super();
  }

  render()
  {
    Graphics.clear(undefined, CameraManager.current, true, true);

    Graphics.render(SceneManager.current, CameraManager.current);
  }
}
