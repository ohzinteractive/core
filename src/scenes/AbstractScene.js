import { Scene } from 'three';
// import { AvatarSystem } from '../../components/avatar/AvatarSystem';

import { HighQualityLoadingState } from './loading_states/HighQualityLoadingState';
import { LoadingState } from './loading_states/LoadingState';
import { RegularLoadingState } from './loading_states/RegularLoadingState';

class AbstractScene extends Scene
{
  constructor({ name, compilators })
  {
    super();

    this.name = name;

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
  }

  load()
  {
    this.init();

    this.set_loading_state(this.loading_states.regular);
    this.current_loading_state.load();
  }

  get_objects()
  {
    const objects = [];

    this.traverse(child =>
    {
      if (child.geometry)
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
      if (child.geometry)
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
  }

  dispose()
  {
    this.traverse(child =>
    {
      if (child.material)
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
  }

  set_assets(scene_objects, scene_textures, scene_sounds)
  {
    this.loading_states.regular.set_assets(scene_objects, scene_textures, scene_sounds);
  }

  set_high_assets(scene_objects, scene_textures, scene_sounds)
  {
    this.loading_states.high.set_assets(scene_objects, scene_textures, scene_sounds);
  }

  set_loading_state(state)
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
}

export { AbstractScene };
