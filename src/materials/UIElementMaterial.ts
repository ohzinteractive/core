import frag from '../shaders/ui_element/ui_element.frag';
import vert from '../shaders/ui_element/ui_element.vert';

import { BaseShaderMaterial } from '../materials/BaseShaderMaterial';

import { Vector2, Vector3 } from 'three';

import { OScreen } from '../OScreen';

class UIElementMaterial extends BaseShaderMaterial
{
  constructor()
  {
    super(vert, frag, {
      _MainTex: { value: undefined },
      _ScreenSize: { value: new Vector2(OScreen.width, OScreen.height) },
      _TextureSize: { value: new Vector2() },
      _PixelOffset: { value: new Vector2(0, 0) },
      _NDC: { value: new Vector3() },
      _PivotPoint: { value: new Vector2() },
      _DepthOffset: { value: 0 }
    });
    this.transparent = true;
    this.depthWrite = false;
    this.depthTest = false;
  }
}

export { UIElementMaterial };
