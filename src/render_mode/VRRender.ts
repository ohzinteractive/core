import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { SceneManager } from '../SceneManager';
import { BaseRender } from '../render_mode/BaseRender';

class VRRender extends BaseRender
{
  constructor()
  {
    super();
  }

  render()
  {
    // Graphics.clear(undefined, CameraManager.current, true, true);

    if (SceneManager.current.on_pre_render)
    {
      SceneManager.current.on_pre_render();
    }

    if (SceneManager.current.render)
    {
      SceneManager.current.render();
    }
    else
    {
      Graphics.render(SceneManager.current, CameraManager.current, Graphics._renderer.getRenderTarget());
    }

    this.render_spectator_camera();

    if (SceneManager.current.on_post_render)
    {
      SceneManager.current.on_post_render();
    }
  }

  render_spectator_camera()
  {
    const spectator_camera = CameraManager.spectator;

    if (spectator_camera && Graphics._renderer.xr.isPresenting)
    {
      // Copy the XR Camera's position and rotation, but use your
      // main camera's projection matrix
      const xrCam = Graphics._renderer.xr.getCamera(CameraManager.current);

      spectator_camera.projectionMatrix.copy(CameraManager.current.projectionMatrix);

      spectator_camera.position.copy(xrCam.position);
      spectator_camera.quaternion.copy(xrCam.quaternion);

      // we'll restore this later
      const currentRenderTarget = Graphics._renderer.getRenderTarget();

      // turn off the WebXR rendering
      Graphics._renderer.xr.isPresenting = false;

      // render to the canvas on our main display
      Graphics._renderer.setRenderTarget(null);
      Graphics._renderer.render(SceneManager.current, spectator_camera);

      // reset back to enable WebXR
      Graphics._renderer.setRenderTarget(currentRenderTarget);
      Graphics._renderer.xr.isPresenting = true;
    }
  }
}

export { VRRender };
