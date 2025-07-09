// @ts-check
import { BaseApplication } from './BaseApplication';
import { Debug } from './Debug';
import { Time } from './Time';
import { TransitionManager } from './view_components/TransitionManager';
import { ViewComponentManager } from './view_components/ViewComponentManager';
import { ViewManager } from './view_components/ViewManager';
import { Graphics, KeyboardInput } from './index'; // eslint-disable-line no-unused-vars

class RenderLoop
{
  /**
   * @param {BaseApplication} target_application
   * @param {Graphics} graphics
   */
  constructor(target_application, graphics, input)
  {
    target_application = target_application || new BaseApplication();

    this.target_application = target_application;
    this.graphics = graphics;
    this.input = input;

    this.is_running = false;
    this.frames_passed = 0;

    this.time_accumulator = 0;
  }

  /**
   * @param {number} elapsed_time
   */
  update(elapsed_time)
  {
    if (!this.is_running)
    {
      return;
    }
    Time.__update(elapsed_time);

    // ###### START CYCLE ######
    if (this.frames_passed === 1)
    {
      this.target_application.on_post_start();
    }

    this.input.update();

    this.time_accumulator += Time.delta_time;

    this.target_application.before_update();
    TransitionManager.before_update();

    while (this.time_accumulator > Time.fixed_delta_time)
    {
      this.target_application.fixed_update();
      TransitionManager.fixed_update();

      this.time_accumulator -= Time.fixed_delta_time;
    }
    Time.__set_frame_interpolation(this.time_accumulator / Time.fixed_delta_time);

    this.target_application.update();

    TransitionManager.update();
    ViewManager.update();
    ViewComponentManager.update();

    this.target_application.on_pre_render();

    this.graphics.update();     // render scene
    this.target_application.on_post_render();

    Debug.render(this.graphics);             // render debug layer

    // ###### END  CYCLE #######
    this.target_application.on_frame_end();
    this.frames_passed++;

    this.input.clear();
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

  /**
   * @param {BaseApplication} new_state
   */
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
