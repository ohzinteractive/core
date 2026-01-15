import { OScreen } from '../OScreen';

import { UIElementMaterial } from '../materials/UIElementMaterial';

import { ScreenSpacePosition } from '../ui/ui_element_position/ScreenSpacePosition';
import { WorldSpacePosition } from '../ui/ui_element_position/WorldSpacePosition';

import { OnIdle } from '../ui/ui_element_state/OnIdle';
import { OnMouseEnter } from '../ui/ui_element_state/OnMouseEnter';
import { OnMouseExit } from '../ui/ui_element_state/OnMouseExit';
import { OnMouseHover } from '../ui/ui_element_state/OnMouseHover';

import type { Texture} from 'three';
import { Box2, Mesh, NearestFilter, PlaneGeometry, Vector2 } from 'three';
import type { UIElementState } from '../ui/ui_element_state/UIElementState';

class UIElement extends Mesh
{
  _on_enter_state: OnMouseEnter;
  _on_exit_state: OnMouseExit;
  _on_hover_state: OnMouseHover;
  _on_idle_state: OnIdle;
  cached_NDC_position: Vector2;
  current_state: UIElementState;
  is_clickable: boolean;
  mouse_pos_tmp: Vector2;
  on_enter: any;
  on_exit: any;
  on_hover: any;
  pixel_offset: Vector2;
  position_strategy: WorldSpacePosition | ScreenSpacePosition;
  screen_pos_tmp: Vector2;
  size: number;
  texture_size: Vector2;
  material: UIElementMaterial;

  constructor(vert?: string, frag?: string) 
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

  set_render_order(value: number)
  {
    this.renderOrder = value;
  }
  
  get pivot_point()
  {
    return this.material.uniforms._PivotPoint.value;
  }

  set_pixel_offset(offset: Vector2)
  {
    this.pixel_offset.copy(offset);
    this.material.uniforms._PixelOffset.value.copy(offset);
  }

  set_state(new_state: UIElementState)
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

  set_texture(texture: Texture)
  {
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.needsUpdate = true;

    const image = texture.image as ImageBitmap
    this.texture_size.set(image.width, image.height);

    this.material.uniforms._MainTex.value = texture;
    this.get_size(this.material.uniforms._TextureSize.value);
    this.visible = true;
  }

  update_state(normalized_mouse_pos: Vector2)
  {
    this.material.uniforms._ScreenSize.value.set(OScreen.width, OScreen.height);
    this.get_size(this.material.uniforms._TextureSize.value);

    this.cached_NDC_position.copy(this.position_strategy.get_pos_NDC(this.position));
    this.material.uniforms._NDC.value.copy(this.position);
    this.current_state.update(this, normalized_mouse_pos);
  }

  is_mouse_over(normalized_mouse_pos: Vector2)
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

  to_screen_position(projected_pos: Vector2)
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

  set_screen_space_position(screen_pos: Vector2)
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

  get_size(vector2?: Vector2)
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
