import CameraManager from '../CameraManager';
import SceneManager from '../SceneManager';
import Screen from '../Screen';
import ViewPositionMaterial from '../materials/ViewPositionMaterial';

export default class ViewPositionRenderer
{
	constructor()
	{
    this.RT = new THREE.WebGLRenderTarget(Screen.width, Screen.height, {type: THREE.FloatType});
    this.clear_color = new THREE.Color(0,0,0);
    this.render_pos_mat = new ViewPositionMaterial();

	}


	render(context, renderer)
	{
		if(this.RT.width !== Screen.width || this.RT.height !== Screen.height)
    {
      this.RT.setSize(Screen.width, Screen.height);
    }

    if(CameraManager.current)
    {
      CameraManager.current.aspect = Screen.aspect_ratio;
      CameraManager.current.updateProjectionMatrix();
      CameraManager.current.updateMatrix();
      CameraManager.current.updateMatrixWorld(true);


      renderer.setRenderTarget(this.RT);
      this.clear_color.set(CameraManager.current.far,CameraManager.current.far,CameraManager.current.far);
      renderer.setClearColor(this.clear_color, 1);
      renderer.clear(true,true,false);


			SceneManager.current.overrideMaterial = this.render_pos_mat;
      renderer.render(SceneManager.current, CameraManager.current, this.RT, false);
			SceneManager.current.overrideMaterial = undefined;

    }
	}

	get render_target()
	{
		return this.RT
	}

}
