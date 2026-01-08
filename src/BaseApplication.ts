import { RenderLoop } from './RenderLoop'; // eslint-disable-line no-unused-vars

// @ts-check
class BaseApplication
{
  on_post_start()
  {}

  /**
    * @param {RenderLoop} [loop]
   */
  on_enter(loop) // eslint-disable-line no-unused-vars
  {}

  /**
    * @param {RenderLoop} [loop]
   */
  on_exit(loop) // eslint-disable-line no-unused-vars
  {}

  before_update()
  {}

  update()
  {}

  fixed_update()
  {}

  on_post_render()
  {}

  on_pre_render()
  {}

  on_frame_end()
  {}
}

export { BaseApplication };
