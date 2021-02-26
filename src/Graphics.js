import Configuration from './Configuration';
import BaseRender from './render_mode/BaseRender';
import Screen from './Screen';
import CameraManager from './CameraManager';
import SceneManager from './SceneManager';
import Capabilities from './Capabilities';
import DepthAndNormalsRenderer from './render_utilities/DepthAndNormalsRenderer';
import Blitter from './render_utilities/Blitter';

import { WebGLRenderer } from 'three';

class Graphics
{
  constructor()
  {
    this._renderer = undefined;
    this.blitter = undefined;
    this.canvas = undefined;
    this.no_render = undefined;
    this.current_render_mode = undefined;
    this.generateDepthNormalTexture = false;
    this.depth_and_normals_renderer = undefined;

    this.is_webgl2 = false;
    this.canvas_context = undefined;
    this.context_attributes = undefined;
  }

  init(canvas, context_attributes)
  {
    this.context_attributes = context_attributes || {
      alpha: true,
      depth: true,
      desynchronized: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: false,
      force_webgl2: false
    };

    if (this.context_attributes.force_webgl2)
    {
      this.canvas_context = canvas.getContext('webgl2', this.context_attributes);
      this.is_webgl2 = canvas.getContext('webgl2');
    }
    else
    {
      this.canvas_context = canvas.getContext('webgl', this.context_attributes) ||
                          canvas.getContext('experimental-webgl', this.context_attributes);
      this.is_webgl2 = false;
    }

    console.log(`Using Webgl ${this.is_webgl2 ? 2 : 1}`);

    this._renderer = new WebGLRenderer({
      canvas: canvas,
      context: this.canvas_context
    });
    this._renderer.autoClear = false;

    this._renderer.setPixelRatio(1);

    Screen.dpr = Configuration.dpr;

    if (!this.is_webgl2)
    {
      this._renderer.extensions.get('ANGLE_instanced_arrays');
    }

    this.blitter = new Blitter(this._renderer);

    this.canvas = this._renderer.domElement;

    this.no_render = new BaseRender();

    this.current_render_mode = this.no_render;
    Capabilities.max_anisotropy = this._renderer.capabilities.getMaxAnisotropy();
    Capabilities.vertex_texture_sampler_available = this._renderer.capabilities.maxVertexTextures > 0;
    Capabilities.fp_textures_available = this._renderer.capabilities.floatVertexTextures;

    this.generateDepthNormalTexture = false;

    this.depth_and_normals_renderer = new DepthAndNormalsRenderer();
  }

  get dom_element()
  {
    return this._renderer.domElement;
  }

  get depth_normals_RT()
  {
    return this.depth_and_normals_renderer.render_target;
  }

  set_state(new_state)
  {
    console.log('VIEWAPI - map render mode switch to: ' + new_state.constructor.name);

    this.current_render_mode.on_exit(this, this._renderer);
    this.current_render_mode = new_state;
    this.current_render_mode.on_enter(this, this._renderer);
  }

  update()
  {
    this.check_for_resize();

    if (this.generateDepthNormalTexture)
    {
      this.depth_and_normals_renderer.render(this);
    }

    this.__update_current_camera();

    if (CameraManager.current)
    {
      this.current_render_mode.render();
    }
  }

  __update_current_camera()
  {
    if (CameraManager.current)
    {
      CameraManager.current.aspect = Screen.aspect_ratio;
      CameraManager.current.updateProjectionMatrix();
      CameraManager.current.updateMatrix();
      CameraManager.current.updateMatrixWorld(true);
    }
  }

  render(scene, camera, RT, override_mat)
  {
    this.__apply_override_material(scene, override_mat);

    this._renderer.setRenderTarget(RT === undefined ? null : RT);
    this._renderer.render(scene  || SceneManager.current,
      camera || CameraManager.current);

    this.__apply_override_material(scene, undefined);
  }

  __apply_override_material(scene, mat)
  {
    mat = mat === undefined ? null : mat;
    if (scene)
    {
      scene.overrideMaterial = mat;
    }
    else
    {
      SceneManager.current.overrideMaterial = mat;
    }
  }

  readback_RT(RT, buffer)
  {
    this._renderer.readRenderTargetPixels(RT, 0, 0, RT.width, RT.height, buffer);
  }

  clear(RT, camera, clear_depth, clear_stencil)
  {
    this._renderer.setRenderTarget(RT === undefined ? null : RT);

    if (camera)
    {
      this._renderer.setClearColor(camera.clear_color, camera.clear_alpha);
    }

    this._renderer.clear(!!camera, // clear color
      !!clear_depth,
      !!clear_stencil);
  }

  check_for_resize()
  {
    let current_width   = this.canvas.clientWidth;
    let current_height  = this.canvas.clientHeight;

    if (
      current_width  !== Screen.width  ||
      current_height !== Screen.height ||
      Configuration.dpr !== Screen.dpr
    )
    {
      let canvas_rect = this.canvas.getBoundingClientRect();

      Screen.dpr = Configuration.dpr;
      Screen.update_position(canvas_rect.x, canvas_rect.y);
      Screen.update_size(current_width, current_height);

      this.canvas.width  = Screen.render_width;
      this.canvas.height = Screen.render_height;

      this._renderer.setViewport(0, 0, Screen.render_width, Screen.render_height);

      this.__update_current_camera();
    }
  }

  on_resize()
  {
    console.error('Graphics.on_resize call no longer needed.');
  }

  material_pass(mat, dst)
  {
    this.blitter.material_pass(mat, dst);
  }

  blit(src_RT, dst_RT, mat)
  {
    if (mat)
    {
      this.blitter.blit_with_material(src_RT, dst_RT, mat);
    }
    else
    {
      this.blitter.blit(src_RT, dst_RT);
    }
  }

  blit_clear_with_material(dst_RT, mat)
  {
    this.blitter.blit_clear_with_material(dst_RT, mat);
  }

  take_screenshot(blob_callback)
  {
    // const ctx = this;

    let old_width = Screen.width;
    let old_height = Screen.height;

    let new_width = 4096;
    let new_height = 4096;

    let tile_width = 1024;
    let tile_height = 1024;

    let divisions_x = parseInt(Math.ceil(new_width / tile_width));
    let divisions_y = parseInt(Math.ceil(new_height / tile_height));

    Screen.update_size(tile_width, tile_height);

    this._renderer.setPixelRatio(1);

    this._renderer.setSize(tile_width, tile_height, false);

    this.ctx_2D.canvas.width  = new_width;
    this.ctx_2D.canvas.height = new_height;

    CameraManager.current.aspect = Screen.aspect_ratio;
    CameraManager.current.updateMatrix();
    CameraManager.current.updateMatrixWorld(true);

    for (let x = 0; x < divisions_x; x++)
    {
      for (let y = 0; y < divisions_y; y++)
      {
        CameraManager.current.setViewOffset(new_width,             new_height,
          Screen.width * x,         Screen.height * y,
          Screen.width,            Screen.height);
        this.current_render_mode.render();

        this.ctx_2D.drawImage(this._renderer.domElement, Screen.width * x, Screen.height * y);
      }
    }

    // transform the result canvas into a blob
    // from them the callback turns into a ULR and download it
    this.ctx_2D.canvas.toBlob(blob_callback, 'image/png;base64;');

    CameraManager.current.clearViewOffset();
    Screen.update_size(old_width, old_height);
    this._renderer.setPixelRatio(Configuration.dpr);
    this._renderer.setSize(old_width, old_height, false);

    CameraManager.current.aspect = Screen.aspect_ratio;
    CameraManager.current.updateMatrix();
    CameraManager.current.updateMatrixWorld(true);
  }

  download_screenshot(blob)
  {
    let link = document.createElement('a');
    link.download = 'Snapshot.png';

    link.href = URL.createObjectURL(blob);
    link.click();

    link.onclick = function()
    {
      requestAnimationFrame(function()
      {
        URL.revokeObjectURL(link.href);
      });
      link.removeAttribute('href');
    };
  }
}

export default new Graphics();
