
import Screen from '../Screen';

import UIElementMaterial from '../materials/UIElementMaterial';

import ScreenSpacePosition from '../ui/ui_element_position/ScreenSpacePosition';
import WorldSpacePosition from '../ui/ui_element_position/WorldSpacePosition';

import OnIdle from '../ui/ui_element_state/OnIdle';
import OnMouseEnter from '../ui/ui_element_state/OnMouseEnter';
import OnMouseExit from '../ui/ui_element_state/OnMouseExit';
import OnMouseHover from '../ui/ui_element_state/OnMouseHover';

import { Mesh } from 'three';
import { PlaneGeometry } from 'three';
import { Vector2 } from 'three';
import { Vector3 } from 'three';
import { NearestFilter } from 'three';
import { Box2 } from 'three';

export default class UIElement extends Mesh
{
  constructor(vert, frag)
  {
    super(new PlaneGeometry(1, 1), new UIElementMaterial());

    this.is_clickable = false;

    this.position_strategy = new WorldSpacePosition();
    this.current_state = new OnIdle();

    this._position = new Vector3();

    this._on_idle_state = new OnIdle();
    this._on_enter_state = new OnMouseEnter();
    this._on_exit_state = new OnMouseExit();
    this._on_hover_state = new OnMouseHover();

    this.on_enter = undefined;
    this.on_exit = undefined;
    this.on_hover = undefined;

    this.mouse_pos_tmp = new Vector2();
    this.cached_NDC_position = new Vector2();
    this.screen_pos_tmp = new Vector2();

    this.texture_size = new Vector2(1, 1);

    this.frustumCulled = false;
    this.matrixAutoUpdate = false;
    this.renderOrder = 0;

    this.size = 1;
    this.pixel_offset = new Vector2();
  }

  set_render_order(value)
  {
    this.renderOrder = value;
  }

  get pivot_point()
  {
    return this.material.uniforms._PivotPoint.value;
  }

  set_pixel_offset(offset)
  {
    this.pixel_offset.copy(offset);
    this.material.uniforms._PixelOffset.value.copy(offset);
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

  get use_depth()
  {
    return this.material.depthTest;
  }

  set depth_offset(value)
  {
    this.material.uniforms._DepthOffset.value = value;
  }

  get depth_offset()
  {
    return this.material.uniforms._DepthOffset.value;
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
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
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
    this.screen_pos_tmp.copy(this.cached_NDC_position);
    this.to_screen_position(this.screen_pos_tmp);
    this.screen_pos_tmp.x += this.pixel_offset.x;
    this.screen_pos_tmp.y += this.pixel_offset.y;

    const rect = new Box2().setFromCenterAndSize(this.screen_pos_tmp, this.get_size());

    this.mouse_pos_tmp.copy(normalized_mouse_pos);
    this.to_screen_position(this.mouse_pos_tmp);

    return rect.containsPoint(this.mouse_pos_tmp);
  }

  to_screen_position(projected_pos)
  {
    projected_pos.x = (projected_pos.x * 0.5 + 0.5) * Screen.width  + this.pixel_offset.x;
    projected_pos.y = (projected_pos.y * 0.5 + 0.5) * Screen.height + this.pixel_offset.y;
  }

  get_screen_space_position()
  {
    const pos = this.cached_NDC_position.clone();
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
    if (this.material.uniforms._MainTex.value)
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
      return new Vector2().copy(this.texture_size).multiplyScalar(this.size / Screen.dpr);
    }
  }

  on_mouse_enter()
  {}

  on_mouse_exit()
  {}

  on_mouse_hover()
  {}
}
