import { CameraManager } from './CameraManager';
import { OScreen } from './OScreen';
import { SceneManager } from './SceneManager';

import { BaseRender } from './render_mode/BaseRender';
import { Blitter } from './render_utilities/Blitter';
import { DepthAndNormalsRenderer } from './render_utilities/DepthAndNormalsRenderer';

import type {
  Material,
  RenderTarget,
  Scene,
  TypedArray
} from 'three';

import type { Renderer } from 'three/webgpu';
import { WebGPURenderer } from 'three/webgpu';
import type { OrthographicCamera } from './OrthographicCamera';
import type { PerspectiveCamera } from './PerspectiveCamera';
import type { AbstractScene } from './scenes/AbstractScene';

export interface CoreAttributes {
    xr_enabled: boolean;
}
export interface RendererAttributes {
  canvas: HTMLCanvasElement,
  alpha: boolean,
  logarithmicDepthBuffer: boolean,
  antialias: boolean,
  preserveDrawingBuffer: boolean,
  forceWebGL: boolean
}
class Graphics
{
  _renderer: Renderer;
  blitter: Blitter;
  canvas: HTMLCanvasElement;
  core_attributes: CoreAttributes;
  current_render_mode: BaseRender;
  depth_and_normals_renderer: DepthAndNormalsRenderer;
  generate_depth_normal_texture: boolean;
  no_render: BaseRender;
  
  init({ core_attributes, renderer_attributes, dpr }: 
       { core_attributes: CoreAttributes, renderer_attributes: RendererAttributes, dpr: number })
  {
    this._renderer = undefined;
    this.blitter = undefined;
    this.canvas = undefined;
    this.no_render = undefined;
    this.current_render_mode = undefined;
    this.generate_depth_normal_texture = false;
    this.depth_and_normals_renderer = undefined;

    this.core_attributes = {
      xr_enabled: false
    };

    Object.assign(this.core_attributes, core_attributes);

    this._renderer = new WebGPURenderer(renderer_attributes);

    if (this.core_attributes.xr_enabled)
    {
      this._renderer.xr.enabled = true;
    }
    else
    {
      this._renderer.autoClear = false;
    }

    OScreen.dpr = dpr;
    this._renderer.setPixelRatio(1);

    this.blitter = new Blitter(this._renderer);

    this.canvas = this._renderer.domElement;

    this.no_render = new BaseRender();

    this.current_render_mode = this.no_render;

    // Capabilities.max_anisotropy = this._renderer.capabilities.getMaxAnisotropy();
    // Capabilities.vertex_texture_sampler_available = this._renderer.capabilities.maxVertexTextures > 0;

    this.generate_depth_normal_texture = false;

    this.depth_and_normals_renderer = new DepthAndNormalsRenderer();
  }

  get dom_element()
  {
    return this._renderer.domElement;
  }

  get depth_normals_RT(): RenderTarget
  {
    return this.depth_and_normals_renderer.render_target;
  }

  set_state(new_state: BaseRender): void
  {
    // console.log('VIEWAPI - map render mode switch to: ' + new_state.constructor.name);

    this.current_render_mode.on_exit(this, this._renderer);
    this.current_render_mode = new_state;
    this.current_render_mode.on_enter(this, this._renderer);
  }

  update(): void
  {
    if (this.generate_depth_normal_texture)
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

  __update_current_camera(): void
  {
    if (CameraManager.current)
    {
      CameraManager.current.aspect = OScreen.aspect_ratio;
      CameraManager.current.updateProjectionMatrix();
      CameraManager.current.updateMatrix();
      CameraManager.current.updateMatrixWorld(true);
    }
  }

  render(scene?: AbstractScene, camera?: PerspectiveCamera | OrthographicCamera, RT?: RenderTarget, override_mat?: Material): void
  {
    this.__apply_override_material(scene, override_mat);

    this._renderer.setRenderTarget(RT === undefined ? null : RT);
    this._renderer.render(scene || SceneManager.current,
      camera || CameraManager.current);

    this.__apply_override_material(scene, undefined);
  }

  async compile(scene: AbstractScene, camera: PerspectiveCamera, RT: RenderTarget, override_mat: Material): Promise<void>
  {
    this.__apply_override_material(scene, override_mat);

    this._renderer.setRenderTarget(RT === undefined ? null : RT);
    
    await this._renderer.compile(scene || SceneManager.current, camera || CameraManager.current);

    this.__apply_override_material(scene, undefined);
  }

  async compile_async(scene: AbstractScene, camera: PerspectiveCamera, RT: RenderTarget, override_mat: Material, target_scene: Scene)
  {
    this.__apply_override_material(scene, override_mat);

    this._renderer.setRenderTarget(RT === undefined ? null : RT);
    const promise = this._renderer.compileAsync(scene  || SceneManager.current,
      camera || CameraManager.current, target_scene);

    this.__apply_override_material(scene, undefined);

    return promise;
  }

  render_scene(scene: AbstractScene | { render: () => void }): void
  {
    if ('on_pre_render' in scene)
    {
      scene.on_pre_render();
    }

    if ('render' in scene)
    {
      scene.render();
    }
    else
    {
      this.render(scene, undefined);
    }

    if ('on_post_render' in scene)
    {
      scene.on_post_render();
    }
  }

  __apply_override_material(scene: AbstractScene, mat: Material): void
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

  async readback_RT(RT: RenderTarget): Promise<TypedArray>
  {
    return this._renderer.readRenderTargetPixelsAsync(RT, 0, 0, RT.width, RT.height);
  }

  clear(RT: RenderTarget, camera: PerspectiveCamera, clear_depth: boolean, clear_stencil: boolean): void
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

  on_resize(entries: ResizeObserverEntry[], dpr: number): void
  {
    for (const entry of entries)
    {
      OScreen.dpr = dpr;
      // this._renderer.setPixelRatio(dpr);

      OScreen.update_position(entry.contentRect.x, entry.contentRect.y);
      OScreen.update_size(entry.contentRect.width, entry.contentRect.height);

      this.canvas.width  = OScreen.render_width;
      this.canvas.height = OScreen.render_height;

      this._renderer.setViewport(0, 0, OScreen.render_width, OScreen.render_height);

      this._renderer.setSize(window.innerWidth, window.innerHeight);

      this.__update_current_camera();
    }
  }

  material_pass(mat: Material, dst: RenderTarget): void
  {
    this.blitter.material_pass(mat, dst);
  }

  blit(src_RT: RenderTarget, dst_RT: RenderTarget, mat?: Material): void
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

  blit_clear_with_material(dst_RT: RenderTarget, mat: Material): void
  {
    this.blitter.blit_clear_with_material(dst_RT, mat);
  }

  take_screenshot(blob_callback: BlobCallback, width: number = OScreen.width, height: number = OScreen.height): void
  {
    // const ctx = this;

    const old_width = OScreen.width;
    const old_height = OScreen.height;

    const new_width = width;
    const new_height = height;

    const tile_width = 1024;
    const tile_height = 1024;

    const divisions_x = Math.ceil(new_width / tile_width);
    const divisions_y = Math.ceil(new_height / tile_height);

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

  download_screenshot(blob: Blob): void
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

  dispose(): void
  {
    this._renderer.dispose();
    this.current_render_mode.dispose();
    this.blitter.dispose();
  }
}

const graphics = new Graphics();
export { graphics as Graphics };
