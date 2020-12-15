import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/clear/clear_color';

export default class ClearColorMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);
    this.uniforms._Color = { value: new THREE.Color() };
    this.uniforms._Opacity = { value: 1 };

    this.depthTest = true;
    this.depthFunc = THREE.LessEqualDepth;
  }

  set_color(col)
  {
  	this.uniforms._Color.value.set(col);
  }

  copy_color(col)
  {
  	this.uniforms._Color.value.copy(col);
  }

  set_opacity(value)
  {
  	this.uniforms._Opacity.value = value;
  }
}
