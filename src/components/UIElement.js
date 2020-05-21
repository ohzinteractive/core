import UI from '/UI';
import CameraManager from '/CameraManager';
import Screen from '/Screen';

import UIElementMaterial from '/materials/UIElementMaterial';
import screen_space_text_frag from '/shaders/ui/ss_texture_frag';
import screen_space_text_vert from '/shaders/ui/ss_texture_vert';

import ScreenSpacePosition from '/ui/ui_element_position/ScreenSpacePosition';
import WorldSpacePosition from '/ui/ui_element_position/WorldSpacePosition';

import OnIdle from '/ui/ui_element_state/OnIdle';
import OnMouseEnter from '/ui/ui_element_state/OnMouseEnter';
import OnMouseExit from '/ui/ui_element_state/OnMouseExit';
import OnMouseHover from '/ui/ui_element_state/OnMouseHover';


export default class UIElement extends THREE.Mesh
{
  constructor(vert, frag)
  {
    super(new THREE.PlaneGeometry(1, 1), new UIElementMaterial());


    this.is_clickable = false;

    this.position_strategy = new WorldSpacePosition();
    this.current_state = new OnIdle();

    this._position = new THREE.Vector3();

    this._on_idle_state = new OnIdle();
    this._on_enter_state = new OnMouseEnter();
    this._on_exit_state = new OnMouseExit();
    this._on_hover_state = new OnMouseHover();

    this.on_enter = undefined;
    this.on_exit = undefined;
    this.on_hover = undefined;

    this.mouse_pos_tmp = new THREE.Vector2();
    this.cached_NDC_position = new THREE.Vector2();
    this.screen_pos_tmp = new THREE.Vector2();


    this.texture_size = new THREE.Vector2(1,1);


    this.frustumCulled = false;
    this.matrixAutoUpdate = false;
    this.renderOrder = 0;

    this.size = 1;
  }

  set_render_order(value)
  {
    this.renderOrder = value;
  }

  get pivot_point()
  {
    return this.material.uniforms._PivotPoint.value;
  }

  set_state(new_state)
  {
    this.current_state.on_exit(this);
    this.current_state = new_state;
    this.current_state.on_enter(this);
  }

  get position()
  {
    return this._position;
  }

  set use_depth(boolean)
  {
    this.material.depthTest = boolean;
  }

  set depth_offset(value)
  {
    this.material.uniforms._DepthOffset.value = value;
  }

  clear_state()
  {
    this.visible = false;
  }


  set_world_space_coordinate_system()
  {
    this.position_strategy = new WorldSpacePosition();
  }
  set_screen_space_coordinate_system()
  {
    this.position_strategy = new ScreenSpacePosition();
  }

  set_texture(texture)
  {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    this.texture_size.set(texture.image.width, texture.image.height);

    this.material.uniforms._MainTex.value = texture;
    this.get_size(this.material.uniforms._TextureSize.value);
    this.visible = true;
  }

  update_state(normalized_mouse_pos)
  {
    this.material.uniforms._ScreenSize.value.set(Screen.width, Screen.height);
    this.get_size(this.material.uniforms._TextureSize.value);

    this.cached_NDC_position.copy(this.position_strategy.get_pos_NDC(this.position));
    this.material.uniforms._NDC.value.copy(this.position);
    this.current_state.update(this, normalized_mouse_pos);
  }

  is_mouse_over(normalized_mouse_pos)
  {

    this.screen_pos_tmp.copy(this.cached_NDC_position)
    this.to_screen_position(this.screen_pos_tmp);

    let rect = new THREE.Box2().setFromCenterAndSize(this.screen_pos_tmp, this.get_size());


    this.mouse_pos_tmp.copy(normalized_mouse_pos);
    this.to_screen_position(this.mouse_pos_tmp);

    return rect.containsPoint(this.mouse_pos_tmp);
  }

  to_screen_position(projected_pos)
  {
    projected_pos.x = (projected_pos.x * 0.5 + 0.5) * Screen.width;
    projected_pos.y = (projected_pos.y * 0.5 + 0.5) * Screen.height;
  }

  get_screen_space_position()
  {
    let pos = this.cached_NDC_position.clone()
    this.to_screen_position(pos);
    return pos;
  }
  set_screen_space_position(screen_pos)
  {
    this.position.x = (screen_pos.x / Screen.width) * 2 - 1;
    this.position.y = (screen_pos.y / Screen.height) * 2 - 1;
  }

  dispose()
  {
    if(this.material.uniforms._MainTex.value)
    {
      this.material.uniforms._MainTex.value.dispose();
    }
    Screen.remove_screen_material(this.material);
    this.geometry.dispose();
    this.material.dispose();
  }

  get_size(vector2)
  {
    if (vector2)
    {
      return vector2.copy(this.texture_size).multiplyScalar(this.size / Screen.dpr);
    }
    else
    {
      return new THREE.Vector2().copy(this.texture_size).multiplyScalar(this.size / Screen.dpr);
    }
  }

  on_mouse_enter(){}
  on_mouse_exit(){}
  on_mouse_hover(){}

}

