import CameraManager from '/CameraManager';
import SceneManager from '/SceneManager';
import Screen from '/Screen';
import BaseRender from '/render_mode/BaseRender';
import Graphics from '/Graphics';
import NormalMaterial from '/materials/NormalMaterial';
export default class DebugNormalsRender extends BaseRender {
    constructor() {
        super();
    }


    render() {
        Graphics.clear(undefined, CameraManager.current, true, true);

        Graphics.render(SceneManager.current, CameraManager.current, undefined, new NormalMaterial());
    }

}
