import Graphics from './Graphics';
import RenderLoop from './RenderLoop';
import Configuration from './Configuration';

import EventManager from './EventManager';
import Debug from './Debug';
import Input from './Input';

import CameraManager from './CameraManager';
import SceneManager from './SceneManager';

//APP
// import OHZIExampleApplication from './OHZIExam÷pleApplication';

//SERVICES
import ModelUtilities from './utilities/ModelUtilities';
//
import ResourceContainer from './ResourceContainer';

module.exports = (parameters) => {

  // let container = document.getElementById(parameters.main_container);
  // let canvas = document.getElementById('main-canvas');

  // Configuration.is_mobile = parameters.is_mobile;
  // Configuration.is_ios = parameters.is_ios;

  // Graphics.init(canvas)
  // Graphics.append_canvas(container);

  // Input.init(container);
  // Debug.init(Graphics);
  // const application = new OHZIExampleApplication(Graphics);

  // const render_loop = new RenderLoop(application, Graphics);

  // Graphics.on_resize();


  function ViewApi() {
    return {

      scene: SceneManager.current,
      camera: CameraManager.current,

      model_utilities: ModelUtilities,

      take_screenshot: () => {
        Graphics.take_screenshot(Graphics.download_screenshot)
      },

      //#######################################
      //#######################################

      register_event: (name, callback) =>{
        EventManager.on(name, callback);
      },

      config: Configuration,

      draw_debug_axis: () =>{
        Debug.draw_axis();
      },
      update: (val) => {
        application.update_texture(val);
      },

      set_resource: (name, resource)=>{
        ResourceContainer.set_resource(name, resource);
      },

      resize_canvas: ()=>{
        Graphics.on_resize();

      },

      start: ()=>{
        render_loop.start();
      },

      dispose: () =>{
        render_loop.stop();
        Graphics._renderer.dispose();
        map.dispose();
      },

      resource_loading_completed : () => {
        application.resources_fully_loaded()
      },
      version: "0.0.0",
    };
  }

  module.exports = ViewApi;

  return ViewApi();
};
