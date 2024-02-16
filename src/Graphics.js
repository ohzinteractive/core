import { CameraManager } from './CameraManager';
import { Capabilities } from './Capabilities';
import { Configuration } from './Configuration';
import { OScreen } from './OScreen';
import { SceneManager } from './SceneManager';
import { BaseRender } from './render_mode/BaseRender';
import { Blitter } from './render_utilities/Blitter';
import { DepthAndNormalsRenderer } from './render_utilities/DepthAndNormalsRenderer';

import {
  AlwaysDepth,
  FloatType,
  NearestFilter,
  NoBlending,
  NoColorSpace,
  RGBAFormat,
  ShaderMaterial,
  WebGLRenderTarget
} from 'three';

import { WebGLRenderer } from 'three';

class Graphics
{
  init(canvas, core_attributes, context_attributes, threejs_attributes)
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

    this.core_attributes = {
      force_webgl2: true,
      xr_enabled: false
    };

    this.context_attributes = {
      alpha: true,
      antialias: false,
      depth: true,
      desynchronized: false,
      failIfMajorPerformanceCaveat: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      stencil: false
    };

    this.threejs_attributes = {
      logarithmicDepthBuffer: false
    };

    Object.assign(this.core_attributes, core_attributes);
    Object.assign(this.context_attributes, context_attributes);

    Object.assign(this.threejs_attributes, this.context_attributes);
    Object.assign(this.threejs_attributes, threejs_attributes);

    if (this.core_attributes.force_webgl2)
    {
      this.canvas_context = canvas.getContext('webgl2', this.context_attributes) ||
                            canvas.getContext('webgl', this.context_attributes) ||
                            canvas.getContext('experimental-webgl', this.context_attributes);
    }
    else
    {
      this.canvas_context = canvas.getContext('webgl', this.context_attributes) ||
                            canvas.getContext('experimental-webgl', this.context_attributes);
    }

    this.is_webgl2 = this.canvas_context.constructor.name === 'WebGL2RenderingContext';

    // console.log(`Using WebGL ${this.is_webgl2 ? 2 : 1}`);

    this.threejs_attributes.canvas = canvas;
    this.threejs_attributes.context = this.canvas_context;

    this._renderer = new WebGLRenderer(this.threejs_attributes);

    if (this.core_attributes.xr_enabled)
    {
      this._renderer.xr.enabled = true;
    }
    else
    {
      this._renderer.autoClear = false;
    }

    this._renderer.setPixelRatio(1);

    OScreen.dpr = Configuration.dpr;

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
    Capabilities.fp_textures_available = this.is_floating_point_texture_available();

    this.generateDepthNormalTexture = false;

    this.depth_and_normals_renderer = new DepthAndNormalsRenderer();

    this.resize_observer = new ResizeObserver(this.on_resize.bind(this));
    this.resize_observer.observe(this.canvas);
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
    // console.log('VIEWAPI - map render mode switch to: ' + new_state.constructor.name);

    this.current_render_mode.on_exit(this, this._renderer);
    this.current_render_mode = new_state;
    this.current_render_mode.on_enter(this, this._renderer);
  }

  update()
  {
    if (this.generateDepthNormalTexture)
    {
      this.depth_and_normals_renderer.render(this);
    }

    this.__update_current_camera();

    if (CameraManager.current)
    {
      this.current_render_mode.render();
    }

    OScreen.update();
  }

  __update_current_camera()
  {
    if (CameraManager.current)
    {
      CameraManager.current.aspect = OScreen.aspect_ratio;
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

  render_scene(scene)
  {
    if (scene.on_pre_render)
    {
      scene.on_pre_render();
    }

    if (scene.render)
    {
      scene.render();
    }
    else
    {
      this.render(scene, undefined);
    }

    if (scene.on_post_render)
    {
      scene.on_post_render();
    }
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

  on_resize(entries)
  {
    for (const entry of entries)
    {
      OScreen.dpr = Configuration.dpr;
      OScreen.update_position(entry.contentRect.x, entry.contentRect.y);
      OScreen.update_size(entry.contentRect.width, entry.contentRect.height);

      this.canvas.width  = OScreen.render_width;
      this.canvas.height = OScreen.render_height;

      this._renderer.setViewport(0, 0, OScreen.render_width, OScreen.render_height);

      this.__update_current_camera();
    }
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

  take_screenshot(blob_callback, width = OScreen.width, height = OScreen.height)
  {
    // const ctx = this;

    const old_width = OScreen.width;
    const old_height = OScreen.height;

    const new_width = width;
    const new_height = height;

    const tile_width = 1024;
    const tile_height = 1024;

    const divisions_x = parseInt(Math.ceil(new_width / tile_width));
    const divisions_y = parseInt(Math.ceil(new_height / tile_height));

    OScreen.update_size(tile_width, tile_height);
    const old_dpr = this._renderer.getPixelRatio();
    this._renderer.setPixelRatio(1);

    this._renderer.setSize(tile_width, tile_height, false);

    const canvas_2d = document.createElement('canvas');
    const ctx_2D = canvas_2d.getContext('2d');

    ctx_2D.canvas.width  = new_width;
    ctx_2D.canvas.height = new_height;

    CameraManager.current.aspect = OScreen.aspect_ratio;
    CameraManager.current.updateMatrix();
    CameraManager.current.updateMatrixWorld(true);

    for (let x = 0; x < divisions_x; x++)
    {
      for (let y = 0; y < divisions_y; y++)
      {
        CameraManager.current.setViewOffset(new_width,             new_height,
          OScreen.width * x,         OScreen.height * y,
          OScreen.width,            OScreen.height);
        this.current_render_mode.render();

        ctx_2D.drawImage(this._renderer.domElement, OScreen.width * x, OScreen.height * y);
      }
    }

    // transform the result canvas into a blob
    // } from them the callback turns into a ULR and download it
    ctx_2D.canvas.toBlob(blob_callback, 'image/png;base64;');

    CameraManager.current.clearViewOffset();

    OScreen.update_size(old_width, old_height);
    this._renderer.setPixelRatio(old_dpr);
    this._renderer.setSize(old_width, old_height, false);

    CameraManager.current.aspect = OScreen.aspect_ratio;
    CameraManager.current.updateMatrix();
    CameraManager.current.updateMatrixWorld(true);
  }

  download_screenshot(blob)
  {
    const link = document.createElement('a');
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

  dispose()
  {
    this._renderer.dispose();
    this.current_render_mode.dispose();
    this.blitter.dispose();
  }

  is_floating_point_texture_available()
  {
    const RT = new WebGLRenderTarget(1, 1, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      colorSpace: NoColorSpace,
      type: FloatType,
      stencilBuffer: false,
      depthBuffer: false
    });

    const vert = `
      void main()
      {
        gl_Position = vec4(uv * 2.0 - 1.0, 1.0, 1.0);
      }
    `;
    const frag = `
      void main()
      {
        gl_FragColor = vec4(0.0, 4865.35, 0.0, 1.0);
      }
    `;

    const mat = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      depthWrite: false,
      blending: NoBlending,
      depthTest: false,
      depthFunc: AlwaysDepth
    });

    this.material_pass(mat, RT);

    const output = new Float32Array(4);
    this._renderer.readRenderTargetPixels(RT, 0, 0, 1, 1, output);

    return Math.abs(output[1] - 4865.35) < 0.001;
  }
}

const graphics = new Graphics();
export { graphics as Graphics };
