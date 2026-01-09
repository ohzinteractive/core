
import { OScreen } from '../OScreen';

import { UIElementMaterial } from '../materials/UIElementMaterial';

import { ScreenSpacePosition } from '../ui/ui_element_position/ScreenSpacePosition';
import { WorldSpacePosition } from '../ui/ui_element_position/WorldSpacePosition';

import { OnIdle } from '../ui/ui_element_state/OnIdle';
import { OnMouseEnter } from '../ui/ui_element_state/OnMouseEnter';
import { OnMouseExit } from '../ui/ui_element_state/OnMouseExit';
import { OnMouseHover } from '../ui/ui_element_state/OnMouseHover';

import { Box2, Mesh, NearestFilter, PlaneGeometry, Texture, Vector2 } from 'three';
import { UIElementState } from '../ui/ui_element_state/UIElementState';

class UIElement extends Mesh
{
  _on_enter_state: any;
  _on_exit_state: any;
  _on_hover_state: any;
  _on_idle_state: any;
  cached_NDC_position: any;
  current_state: any;
  is_clickable: any;
  mouse_pos_tmp: any;
  on_enter: any;
  on_exit: any;
  on_hover: any;
  pixel_offset: any;
  position_strategy: any;
  screen_pos_tmp: any;
  size: any;
  texture_size: any;
  material: UIElementMaterial;
  /**
   * @param {string} [vert]
   * @param {string} [frag]
   */
  constructor(vert: any, frag: any) 
  {
    const material = new UIElementMaterial();
    super(new PlaneGeometry(1, 1), material);
    this.material = material;

    this.is_clickable = false;

    /** @type {WorldSpacePosition | ScreenSpacePosition} */
    this.position_strategy = new WorldSpacePosition();
    this.current_state = new OnIdle();


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

  /**
   * @param {number} value
   */
  set_render_order(value: any)
  {
    this.renderOrder = value;
  }

  
  get pivot_point()
  {
    return this.material.uniforms._PivotPoint.value;
  }

  /**
   * @param {Vector2} offset
   */
  set_pixel_offset(offset: any)
  {
    this.pixel_offset.copy(offset);
    this.material.uniforms._PixelOffset.value.copy(offset);
  }

  /**
   *@param {UIElementState} new_state
   */
  set_state(new_state: any)
  {
    this.current_state.on_exit(this);
    this.current_state = new_state;
    this.current_state.on_enter(this);
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

  /**
   * @param {Texture} texture
   */
  set_texture(texture: any)
  {
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.needsUpdate = true;

    this.texture_size.set(texture.image.width, texture.image.height);

    this.material.uniforms._MainTex.value = texture;
    this.get_size(this.material.uniforms._TextureSize.value);
    this.visible = true;
  }

  /**
   * @param {Vector2} normalized_mouse_pos
   */
  update_state(normalized_mouse_pos: any)
  {
    this.material.uniforms._ScreenSize.value.set(OScreen.width, OScreen.height);
    this.get_size(this.material.uniforms._TextureSize.value);

    this.cached_NDC_position.copy(this.position_strategy.get_pos_NDC(this.position));
    this.material.uniforms._NDC.value.copy(this.position);
    this.current_state.update(this, normalized_mouse_pos);
  }

  /**
   * @param {Vector2} normalized_mouse_pos
   */
  is_mouse_over(normalized_mouse_pos: any)
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

  /**
   * @param {Vector2} projected_pos
   */
  to_screen_position(projected_pos: any)
  {
    projected_pos.x = (projected_pos.x * 0.5 + 0.5) * OScreen.width  + this.pixel_offset.x;
    projected_pos.y = (projected_pos.y * 0.5 + 0.5) * OScreen.height + this.pixel_offset.y;
  }

  get_screen_space_position()
  {
    const pos = this.cached_NDC_position.clone();
    this.to_screen_position(pos);
    return pos;
  }

  /**
   * @param {Vector2} screen_pos
   */
  set_screen_space_position(screen_pos: any)
  {
    this.position.x = (screen_pos.x / OScreen.width) * 2 - 1;
    this.position.y = (screen_pos.y / OScreen.height) * 2 - 1;
  }

  dispose()
  {
    if (this.material.uniforms._MainTex.value)
    {
      this.material.uniforms._MainTex.value.dispose();
    }
    // OScreen.remove_screen_material(this.material);
    this.geometry.dispose();
    this.material.dispose();
  }

  /**
   * @param {Vector2} [vector2]
   */
  get_size(vector2?: any)
  {
    if (vector2)
    {
      return vector2.copy(this.texture_size).multiplyScalar(this.size / OScreen.dpr);
    }
    else
    {
      return new Vector2().copy(this.texture_size).multiplyScalar(this.size / OScreen.dpr);
    }
  }

  on_mouse_enter()
  {}

  on_mouse_exit()
  {}

  on_mouse_hover()
  {}
}

export { UIElement };
