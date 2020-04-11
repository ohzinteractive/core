import UI from '../UI';
import CameraManager from '../CameraManager';
import Screen from '../Screen';

import screen_space_text_frag from '../shaders/ui/ss_texture_frag';
import screen_space_text_vert from '../shaders/ui/ss_texture_vert';

import ScreenSpacePosition from '../ui/ui_element_position/ScreenSpacePosition';
import WorldSpacePosition from '../ui/ui_element_position/WorldSpacePosition';

import OnIdle from '../ui/ui_element_state/OnIdle';
import OnMouseEnter from '../ui/ui_element_state/OnMouseEnter';
import OnMouseExit from '../ui/ui_element_state/OnMouseExit';
import OnMouseHover from '../ui/ui_element_state/OnMouseHover';


export default class UIElement
{
  constructor(vert, frag)
  {
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




    this.width = 0;
    this.height = 0;


    this.material = new THREE.ShaderMaterial({
    uniforms:  {
      _MainTex: { value: undefined},
      _ScreenSize: { value: new THREE.Vector2(Screen.width, Screen.height) },
      _TextureSize: {value: new THREE.Vector2()},
      _PixelOffset: {value: new THREE.Vector2(0,0)},
      _NDC: {value: new THREE.Vector3()},
      _PivotPoint: {value: new THREE.Vector2()},
      _DepthOffset: {value: 0}
    },
      vertexShader: vert? vert : screen_space_text_vert,
      fragmentShader: frag? frag: screen_space_text_frag,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });


    let geometry = new THREE.PlaneGeometry(1, 1, 1);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.matrixAutoUpdate = false;
    this.mesh.renderOrder = 0;

    UI.add_clickable_element(this);

  }

  set_render_order(value)
  {
    this.mesh.renderOrder = value;
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

  set visible(value)
  {
    this.mesh.visible = value;
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



  set_texture(texture)
  {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    this.width = Screen.apply_pixel_density(texture.image.width);
    this.height = Screen.apply_pixel_density(texture.image.height);


    let texture_size = new THREE.Vector2(texture.image.width , texture.image.height);
    Screen.apply_pixel_density_v2(texture_size);
    this.material.uniforms._MainTex.value = texture;
    this.material.uniforms._TextureSize.value.copy(texture_size);
    this.mesh.visible = true;
  }

  update(normalized_mouse_pos)
  {
    this.cached_NDC_position.copy(this.position_strategy.get_pos_NDC(this.position));
    this.material.uniforms._NDC.value.copy(this.position);
    this.current_state.update(this, normalized_mouse_pos);

  }

  is_mouse_over(normalized_mouse_pos)
  {

    this.screen_pos_tmp.copy(this.cached_NDC_position)
    this.to_screen_position(this.screen_pos_tmp);

    this.mouse_pos_tmp.copy(normalized_mouse_pos);
    this.to_screen_position(this.mouse_pos_tmp);

    if(this.mouse_pos_tmp.x > (this.screen_pos_tmp.x - this.width/2)  &&
       this.mouse_pos_tmp.x < (this.screen_pos_tmp.x + this.width/2)  &&
       this.mouse_pos_tmp.y > (this.screen_pos_tmp.y - this.height/2) &&
       this.mouse_pos_tmp.y < (this.screen_pos_tmp.y + this.height/2))
      return true;
    else
    {
      return false;
    }
  }

  to_screen_position(projected_pos)
  {
    projected_pos.x = (projected_pos.x * 0.5 + 0.5) * Screen.width;
    projected_pos.y = (projected_pos.y * 0.5 + 0.5) * Screen.height;
  }

  resize()
  {
    this.material.uniforms._ScreenSize.value.set(Screen.width, Screen.height);
  }

  dispose()
  {
    if(this.material.uniforms._MainTex.value)
    {
      this.material.uniforms._MainTex.value.dispose();
    }
    Screen.remove_screen_material(this.material);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.remove(this.mesh);
    this.parent.remove(this);
    UI.remove_clickable_element(this);
  }

  get_size(vector2)
  {
    if (vector2)
    {
      return vector2.set(this.width, this.height)
    }
    else
    {
      return new THREE.Vector3(this.width, this.height)
    }
  }
}

