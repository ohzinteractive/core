import RenderLayers from '../RenderLayers';
import OScreen from '../OScreen';

import { Color } from 'three';
import { WebGLRenderTarget } from 'three';
import { Vector2 } from 'three';

export default class ObjectPicker
{
  constructor(renderer, scene, camera)
  {
    this.renderer = renderer;
    this.readback_buffer = new Uint8Array(4);
    this.scene = scene;
    this.camera = camera;
    this.camera_layers = camera.layers;

    this.clear_color = new Color('#000000');
    this.picking_texture = new WebGLRenderTarget(OScreen.width, OScreen.height);
    this.tmp_scene_auto_update = undefined;

    this.tmp_mouse_pos = new Vector2();
  }

  pick(mouse_NDC, objects)
  {
    this.__prepare_scene(objects);
    this.renderer.setRenderTarget(this.picking_texture);
    this.renderer.setClearColor(this.clear_color, 1);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera, this.picking_texture);
    this.renderer.setRenderTarget();

    this.__restore_scene(objects);

    return this.__readback_id(mouse_NDC);
  }

  __prepare_scene(objects)
  {
    for (let i = 0; i < objects.length; i++)
    {
      objects[i].material = objects[i].selectable_material;
      objects[i].store_layer_state();
      objects[i].layers.set(RenderLayers.selectable);
    }

    this.camera_layers = this.camera.layers.mask;
    this.camera.layers.set(RenderLayers.selectable);
    this.tmp_scene_auto_update = this.scene.matrixWorldAutoUpdate;
    this.scene.matrixWorldAutoUpdate = false;
  }

  __restore_scene(objects)
  {
    for (let i = 0; i < objects.length; i++)
    {
      objects[i].restore_material();
      objects[i].restore_layer_state();
    }
    this.camera.layers.mask = this.camera_layers;
    this.scene.matrixWorldAutoUpdate = this.tmp_scene_auto_update;
  }

  __readback_id(mouse_NDC)
  {
    this.tmp_mouse_pos.copy(mouse_NDC);
    this.tmp_mouse_pos.multiplyScalar(0.5);
    this.tmp_mouse_pos.x = (this.tmp_mouse_pos.x + 0.5) * OScreen.width;
    this.tmp_mouse_pos.y = (this.tmp_mouse_pos.y + 0.5) * OScreen.height;
    this.renderer.readRenderTargetPixels(this.picking_texture, this.tmp_mouse_pos.x, this.tmp_mouse_pos.y, 1, 1, this.readback_buffer);

    return (this.readback_buffer[2]) | (this.readback_buffer[1] << 8) | (this.readback_buffer[0] << 16);
  }
}
