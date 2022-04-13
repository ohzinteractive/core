import Browser from './Browser';
import CameraManager from './CameraManager';
import Capabilities from './Capabilities';
import Configuration from './Configuration';
import Debug from './Debug';
import EventManager from './EventManager';
import Graphics from './Graphics';
import Input from './Input';
import OS from './OS';
import OScreen from './OScreen';
import ReflectionPlaneContext from './ReflectionPlaneContext';
import ResourceContainer from './ResourceContainer';
import SceneManager from './SceneManager';
import GeometryBatcher from './static_batcher/GeometryBatcher';
import Time from './Time';
import UI from './UI';
import CameraUtilities from './utilities/CameraUtilities';

class Initializer
{
  constructor()
  {
  }

  init(canvas, app_container, context_attributes, keyboard_input_container = document)
  {
    CameraManager.init();
    CameraUtilities.init();
    Capabilities.init();
    Configuration.init();
    EventManager.init();
    GeometryBatcher.init();
    Input.init(app_container, keyboard_input_container);
    OS.init();
    Browser.init();
    ReflectionPlaneContext.init();
    ResourceContainer.init();
    SceneManager.init();
    OScreen.init();
    Time.init();
    UI.init();

    Graphics.init(canvas, context_attributes);
    Debug.init();
  }

  dispose(render_loop)
  {
    Graphics.dispose();
    Input.dispose();
    SceneManager.dispose();

    render_loop.dispose();
  }
}

export default new Initializer();
