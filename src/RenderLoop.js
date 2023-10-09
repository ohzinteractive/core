import { BaseApplication } from './BaseApplication';
import { Debug } from './Debug';
import { Time } from './Time';
import { UI } from './UI';
import { ViewComponentManager } from './view_components/ViewComponentManager';
import { ViewManager } from './view_components/ViewManager';

class RenderLoop
{
  constructor(target_application, graphics)
  {
    target_application = target_application || new BaseApplication();

    this.target_application = target_application;
    this.graphics = graphics;

    this.is_running = false;
    this.frames_passed = 0;

    this.time_accumulator = 0;
  }

  update()
  {
    if (!this.is_running)
    {
      return;
    }
    Time.__update();

    // ###### START CYCLE ######
    if (this.frames_passed === 1)
    {
      this.target_application.on_post_start();
    }

    this.time_accumulator += Time.delta_time;

    this.target_application.before_update();
    ViewManager.before_update();

    while (this.time_accumulator > Time.fixed_delta_time)
    {
      this.target_application.fixed_update();
      ViewManager.fixed_update();
      this.time_accumulator -= Time.fixed_delta_time;
    }
    Time.__set_frame_interpolation(this.time_accumulator / Time.fixed_delta_time);

    this.target_application.update();

    ViewManager.update();
    ViewComponentManager.update();

    this.target_application.on_pre_render();

    this.graphics.update();     // render scene
    UI.update();                // update after new camera matrix has been calculated
    UI.render(this.graphics);   // render ui layer on top
    this.target_application.on_post_render();

    Debug.render(this.graphics);             // render debug layer

    // ###### END  CYCLE #######

    this.target_application.on_frame_end();
    this.frames_passed++;

    UI.clear();
    Debug.clear();
  }

  start()
  {
    if (this.is_running) return; // sanity check

    if (this.frames_passed === 0)
    {
      this.target_application.on_enter();
    }

    this.is_running = true;

    this.graphics._renderer.setAnimationLoop(this.update.bind(this));
  }

  stop()
  {
    if (this.is_running === false) return; // sanity check

    this.is_running = false;
    this.target_application.on_exit();

    this.graphics._renderer.setAnimationLoop(null);
  }

  set_state(new_state)
  {
    this.target_application.on_exit(this);
    this.target_application = new_state;
    this.target_application.on_enter(this);
  }

  dispose()
  {
    this.stop();
    this.frames_passed = 0;
  }
}

export { RenderLoop };
