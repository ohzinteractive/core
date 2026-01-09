import { BaseApplication } from './BaseApplication';
import { Debug } from './Debug';
import type { Graphics } from './Graphics';
import { Time } from './Time';
import { TransitionManager } from './view_components/TransitionManager';
import { ViewComponentManager } from './view_components/ViewComponentManager';
import { ViewManager } from './view_components/ViewManager';

class RenderLoop
{
  frames_passed: number;
  graphics: typeof Graphics;
  input: any;
  is_running: boolean;
  target_application: BaseApplication;
  time_accumulator: number;

  constructor(target_application: BaseApplication, graphics: typeof Graphics, input: any)
  {
    target_application = target_application || new BaseApplication();

    this.target_application = target_application;
    this.graphics = graphics;
    this.input = input;

    this.is_running = false;
    this.frames_passed = 0;

    this.time_accumulator = 0;
  }

  update(elapsed_time: number)
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
      this.target_application.on_enter(this);
    }

    this.is_running = true;

    this.graphics._renderer.setAnimationLoop(this.update.bind(this));
  }

  stop()
  {
    if (this.is_running === false) return; // sanity check

    this.is_running = false;
    this.target_application.on_exit(this);

    this.graphics._renderer.setAnimationLoop(null);
  }

  set_state(new_state: BaseApplication)
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
