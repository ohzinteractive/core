import type { RenderLoop } from './RenderLoop';

class BaseApplication
{
  on_post_start()
  {}

  on_enter(loop?: RenderLoop): void
  {}

  on_exit(loop?: RenderLoop): void
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
