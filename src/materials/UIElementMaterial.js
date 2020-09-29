import vert from '../shaders/ui_element/ui_element.vert';
import frag from '../shaders/ui_element/ui_element.frag';
import BaseShaderMaterial from '../materials/BaseShaderMaterial';
import * as THREE from 'three';

export default class UIElementMaterial extends BaseShaderMaterial
{
  constructor(intensity = 1)
  {
    super(vert, frag, {
      _MainTex: { value: undefined },
      _ScreenSize: { value: new THREE.Vector2(Screen.width, Screen.height) },
      _TextureSize: { value: new THREE.Vector2() },
      _PixelOffset: { value: new THREE.Vector2(0, 0) },
      _NDC: { value: new THREE.Vector3() },
      _PivotPoint: { value: new THREE.Vector2() },
      _DepthOffset: { value: 0 }
    });
    this.transparent = true;
    this.depthWrite = false;
    this.depthTest = false;
  }
}
