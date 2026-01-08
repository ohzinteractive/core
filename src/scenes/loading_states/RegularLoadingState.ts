import { LoadingState } from './LoadingState';

export class RegularLoadingState extends LoadingState
{
  constructor(scene, compilators)
  {
    super(scene, compilators);

    this.on_assets_ready_called = false;
  }

  on_enter()
  {
    super.on_enter();
    // this.setup_loader();
  }

  on_exit()
  {
    super.on_exit();
  }

  update()
  {
    super.update();

    if (this.is_loaded())
    {
      if (!this.on_assets_ready_called)
      {
        this.scene.on_assets_ready();
        this.on_assets_ready_called = true;
      }

      if (this.is_compiled())
      {
        this.scene.on_assets_compiled();
      }
    }
  }
}
