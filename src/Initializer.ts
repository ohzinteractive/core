import { Browser } from './Browser';
import { CameraManager } from './CameraManager';
import { Capabilities } from './Capabilities';
import type { Input } from './components/Input';
import { Debug } from './Debug';
import { Graphics } from './Graphics';
import type { RenderLoop } from './index';
import { OS } from './OS';
import { OScreen } from './OScreen';
import { ReflectionPlaneContext } from './ReflectionPlaneContext';
import { ResourceContainer } from './ResourceContainer';
import { SceneManager } from './SceneManager';
import { Time } from './Time';
import { CameraUtilities } from './utilities/CameraUtilities';

class Initializer
{
  constructor()
  {
  }

  init(input: Input)
  {
    CameraManager.init();
    CameraUtilities.init(input);
    Capabilities.init();

    OS.init();
    Browser.init();
    ReflectionPlaneContext.init();
    ResourceContainer.init();
    SceneManager.init();
    OScreen.init();
    Time.init();

    Debug.init();
  }

  dispose(render_loop: RenderLoop)
  {
    Graphics.dispose();
    SceneManager.dispose();

    render_loop.dispose();
  }
}

const initializer = new Initializer();
export { initializer as Initializer };
