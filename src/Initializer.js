import { CameraManager } from './CameraManager';
import { Capabilities } from './Capabilities';
import { Configuration } from './Configuration';
import { Debug } from './Debug';
import { EventManager } from './EventManager';
import { Graphics } from './Graphics';
import { OS } from './OS';
import { OScreen } from './OScreen';
import { ReflectionPlaneContext } from './ReflectionPlaneContext';
import { ResourceContainer } from './ResourceContainer';
import { SceneManager } from './SceneManager';
import { GeometryBatcher } from './static_batcher/GeometryBatcher';
import { Time } from './Time';
import { UI } from './UI';
import { CameraUtilities } from './utilities/CameraUtilities';

class Initializer
{
  constructor()
  {
  }

  init(input)
  {
    CameraManager.init();
    CameraUtilities.init(input);
    Capabilities.init();
    Configuration.init();
    EventManager.init();
    GeometryBatcher.init();

    OS.init();
    ReflectionPlaneContext.init();
    ResourceContainer.init();
    SceneManager.init();
    OScreen.init();
    Time.init();
    UI.init(input);

    Debug.init();
  }

  dispose()
  {
    Graphics.dispose();
    SceneManager.dispose();
  }
}

const initializer = new Initializer();
export { initializer as Initializer };
