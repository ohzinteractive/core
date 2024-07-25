
import { CommonScene } from './common/CommonScene';

import { Settings } from '../Settings';
import { Sections } from '../views/Sections';

import { template_high_objects } from '../../data/assets/template/high/template_high_objects';
import { template_high_sounds } from '../../data/assets/template/high/template_high_sounds';
import { template_high_textures } from '../../data/assets/template/high/template_high_textures';
import { template_objects } from '../../data/assets/template/template_objects';
import { template_sounds } from '../../data/assets/template/template_sounds';
import { template_textures } from '../../data/assets/template/template_textures';

import { Debug, Grid } from 'ohzi-core';

class TemplateScene extends CommonScene
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE
    });
  }

  init()
  {
    this.set_assets(template_objects, template_textures, template_sounds);

    if (Settings.debug_mode)
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
    this.set_high_assets(template_high_objects, template_high_textures, template_high_sounds);

    super.on_assets_ready();
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
  }
}

export { TemplateScene };
