
import { AbstractScene } from './common/AbstractScene';

import { Sections } from '../views/Sections';

import { template_objects } from '../../data/assets/template/template_objects';
import { template_textures } from '../../data/assets/template/template_textures';
import { template_sounds } from '../../data/assets/template/template_sounds';
import { template_high_objects } from '../../data/assets/template/high/template_high_objects';
import { template_high_textures } from '../../data/assets/template/high/template_high_textures';
import { template_high_sounds } from '../../data/assets/template/high/template_high_sounds';

import { Debug, Grid } from 'ohzi-core';

class TemplateScene extends AbstractScene
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE,
      scene_objects: template_objects,
      scene_textures: template_textures,
      scene_sounds: template_sounds,
      scene_high_objects: template_high_objects,
      scene_high_textures: template_high_textures,
      scene_high_sounds: template_high_sounds
    });
  }

  init()
  {
    if (window.debug_mode)
    {
      this.add(Debug.draw_axis());
      this.add(new Grid());
    }
  }

  update()
  {
    super.update();
  }

  on_assets_ready()
  {
    super.on_assets_ready();
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
  }
}

export { TemplateScene };
