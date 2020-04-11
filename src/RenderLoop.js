import Time from '/Time';
import Input from '/Input';
import UI from '/UI';
import Debug from '/Debug';
import GeometryBatcher from '/static_batcher/GeometryBatcher';
import BaseApplication from '/BaseApplication';

export default class RenderLoop {

  constructor(target_application, renderer) {

    target_application = target_application || new BaseApplication();

    this._frame_id = -1;

    this.target_application = target_application;
    this.renderer = renderer;

    this.is_running = true;

  }

  update() {

    if(!this.is_running)
      return;

    Time.__update();
    Debug.clear();

    //###### START CYCLE ######

    this.target_application.update();

    this.target_application.on_pre_render();

    this.renderer.update();     // render scene
    UI.update();                // update after new camera matrix has been calculated
    UI.render(this.renderer);   // render ui layer on top

    this.target_application.on_post_render();

    if(Debug.rt_debug)
      this.renderer.blit(Debug.rt_debug);
    //###### END  CYCLE #######
    Input.clear();
    UI.clear();

    //   GeometryBatcher.upload_texture_data(this.renderer);

    this._frame_id = requestAnimationFrame(this.update.bind(this));
  }

  start() {
    this.target_application.start();
    this.update();
    this.is_running = true;


  }

  stop() {
    this.is_running = false;
    this.target_application.end();

    cancelAnimationFrame(this._frame_id);
  }
}
