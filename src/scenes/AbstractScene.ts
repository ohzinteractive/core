import { Mesh, Scene } from 'three';
// import { AvatarSystem } from '../../components/avatar/AvatarSystem';

import { HighQualityLoadingState } from './loading_states/HighQualityLoadingState';
import { LoadingState } from './loading_states/LoadingState';
import { RegularLoadingState } from './loading_states/RegularLoadingState';

class AbstractScene extends Scene
{
  current_loading_state: any;
  initialized: any;
  is_high_loaded: any;
  is_loaded: any;
  loading_states: any;
  constructor({
    name,
    compilators
  }: any)
  {
    super();

    this.name = name;

    this.initialized = false;
    this.is_loaded = false;
    this.is_high_loaded = false;

    this.loading_states = {
      regular: new RegularLoadingState(this, compilators),
      high: new HighQualityLoadingState(this, compilators)
    };

    this.current_loading_state = new LoadingState(this, compilators);
    // this.set_loading_state(this.loading_states.regular);
  }
  
  get loading_progress()
  {
    return this.current_loading_state.loading_progress;
  }

  init()
  {
    this.initialized = true;
  }

  load()
  {
    if (!this.initialized)
    {
      this.init();
    }

    this.set_loading_state(this.loading_states.regular);
    this.current_loading_state.load();
  }

  get_objects()
  {
    const objects: any = [];

    this.traverse(child =>
    {
      if (child instanceof Mesh && child.geometry)
      {
        objects.push(child);

        // if (child.name === 'pitch_floor')
        // {
        //   objects.push(child);
        // }
        // else
        // {
        //   child.visible = false;
        // }
      }
    });

    return objects;
  }

  dispose_cpu()
  {
    this.traverse(child =>
    {
      if (child instanceof Mesh && child.geometry)
      {
        child.geometry.attributes.position.array = new Float32Array(3);
        if (child.geometry.attributes.normal)
        {
          child.geometry.attributes.normal.array = new Float32Array(3);
        }
        if (child.geometry.attributes.uv)
        {
          child.geometry.attributes.uv.array = new Float32Array(2);
        }
        if (child.material.map)
        {
          for (let i = 0; i < child.material.map.mipmaps.length; i++)
          {
            child.material.map.mipmaps[i] = new Uint8Array(4);
          }
        }
      }
    });

    // AvatarSystem.component_container.component_instancer.data_texture.data = new Float32Array(4);

    this.initialized = false;
  }

  dispose()
  {
    this.traverse(child =>
    {
      if (child instanceof Mesh && child.material)
      {
        if (child.material.map)
        {
          child.material.map.dispose();
        }

        child.material.dispose();
        child.geometry.dispose();
      }
    });
    // AvatarSystem.component_container.component_instancer.data_texture.data = new Float32Array(4);

    this.initialized = false;
  }

  set_assets(scene_objects: any, scene_textures: any, scene_sounds: any, custom_loaders: any, custom_compilators: any, custom_data: any)
  {
    this.loading_states.regular.set_assets(scene_objects, scene_textures, scene_sounds, custom_loaders, custom_compilators, custom_data);
  }

  set_high_assets(scene_objects: any, scene_textures: any, scene_sounds: any, custom_loaders: any, custom_compilators: any, custom_data: any)
  {
    this.loading_states.high.set_assets(scene_objects, scene_textures, scene_sounds, custom_loaders, custom_compilators, custom_data);
  }

  set_loading_state(state: any)
  {
    this.current_loading_state.on_exit();
    this.current_loading_state = state;
    this.current_loading_state.on_enter();
  }

  // Called from transition
  update_loading_state()
  {
    if (!this.is_high_loaded)
    {
      this.current_loading_state.update();
    }
  }

  update()
  {
    this.update_loading_state();
  }

  on_assets_ready()
  {

  }

  on_assets_compiled()
  {
    this.is_loaded = true;

    // Load high quality assets
    this.set_loading_state(this.loading_states.high);
    this.current_loading_state.load();
  }

  on_high_quality_assets_ready()
  {
    this.is_high_loaded = true;
  }

  on_post_render()
  {}

  on_pre_render()
  {}

}

export { AbstractScene };
