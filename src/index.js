import BaseApplication from '/BaseApplication';
import BaseShaderMaterial from '/materials/BaseShaderMaterial';
import CameraManager from '/CameraManager';
import Capabilities from '/Capabilities';
import Components from '/Components';
import CanvasDrawer from '/canvas_drawer/CanvasDrawer';
import Configuration from '/Configuration';
import CSSAnimator from '/html_utilities/CSSAnimator';
import Debug from '/Debug';
import DebugNormalsRender from '/render_mode/DebugNormalsRender';
import EventManager from '/EventManager';
import Graphics from '/Graphics';
import Input from '/Input';
import JSONLoader from '/resource_loader/JSONLoader';
import NormalAORender from '/render_mode/NormalAORender';
import NormalRender from '/render_mode/NormalRender';
import OS from '/OS';
import PerspectiveCamera from '/PerspectiveCamera';
import Primitives from '/Primitives';
import RenderLoop from '/RenderLoop';
import ResourceBatch from '/resource_loader/ResourceBatch';
import ResourceContainer from '/ResourceContainer';
import SceneManager from '/SceneManager';
import Screen from '/Screen';
import SimpleTextDrawer from '/canvas_drawer/SimpleTextDrawer';
import Time from '/Time';
import TouchInput from '/TouchInput';
import UI from '/UI';
import BlitMaterial from '/materials/BlitMaterial';
import BaseRender from '/render_mode/BaseRender';
import Utilities from './utilities';

module.exports = {
  BaseApplication: BaseApplication,
  BaseShaderMaterial: BaseShaderMaterial,
  CameraManager: CameraManager,
  CanvasDrawer: CanvasDrawer,
  Capabilities: Capabilities,
  Components: Components,
  Configuration: Configuration,
  CSSAnimator: CSSAnimator,
  Debug: Debug,
  DebugNormalsRender: DebugNormalsRender,
  EventManager: EventManager,
  Graphics: Graphics,
  Input: Input,
  JSONLoader: JSONLoader,
  NormalAORender: NormalAORender,
  NormalRender: NormalRender,
  OS: OS,
  PerspectiveCamera: PerspectiveCamera,
  Primitives: Primitives,
  RenderLoop: RenderLoop,
  ResourceBatch: ResourceBatch,
  ResourceContainer: ResourceContainer,
  SceneManager: SceneManager,
  Screen: Screen,
  SimpleTextDrawer: SimpleTextDrawer,
  Time: Time,
  TouchInput: TouchInput,
  UI: UI,
  MeshSampler: MeshSampler,
  BlitMaterial: BlitMaterial,
  BaseRender: BaseRender,
  Utilities: Utilities
}
