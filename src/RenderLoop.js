import Time from './Time';
import Input from './Input';
import UI from './UI';
import Debug from './Debug';
import BaseApplication from './BaseApplication';

export default class RenderLoop
{
  constructor(target_application, renderer)
  {
    target_application = target_application || new BaseApplication();

    this._frame_id = -1;

    this.target_application = target_application;
    this.renderer = renderer;

    this.is_running = true;
    this.frames_passed = 0;
  }

  update()
  {
    if (!this.is_running)
    {
      return;
    }

    Time.__update();

    // ###### START CYCLE ######
    if (this.frames_passed === 5)
    {
      this.target_application.post_start();
    }

    this.target_application.update();

    this.target_application.on_pre_render();

    this.renderer.update();     // render scene
    UI.update();                // update after new camera matrix has been calculated
    UI.render(this.renderer);   // render ui layer on top
    Debug.render();             // render debug layer

    this.target_application.on_post_render();

    // ###### END  CYCLE #######
    Input.clear();
    UI.clear();
    Debug.clear();

    //   GeometryBatcher.upload_texture_data(this.renderer);

    this._frame_id = requestAnimationFrame(this.update.bind(this));
    this.frames_passed++;
  }

  start()
  {
    this.renderer.check_for_resize();
    this.target_application.start();
    this.update();
    this.is_running = true;
  }

  stop()
  {
    this.is_running = false;
    this.target_application.end();

    cancelAnimationFrame(this._frame_id);
  }
}
