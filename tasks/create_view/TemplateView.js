import { template_high_sounds } from '../../../data/assets/template/high/template_high_sounds';
import { Sections, SectionsURLs } from '../Sections';
import { CommonView } from '../common/CommonView';

class TemplateView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE,
      url: SectionsURLs.TEMPLATE,
      container: document.querySelector('.template')
    });

    this.sounds_data = template_high_sounds;
  }

  start()
  {
    super.start();

    // AudioManager.setup_sounds_names([...this.sounds_data]);
  }

  before_enter()
  {
    super.before_enter();
  }

  on_enter()
  {
    super.on_enter();
  }

  before_exit()
  {
    super.before_exit();
  }

  on_exit()
  {
    super.on_exit();
  }

  update()
  {
    super.update();
  }

  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_enter_transition(global_view_data, transition_progress, action_sequencer);
  }

  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    super.update_exit_transition(global_view_data, transition_progress, action_sequencer);
  }
}

export { TemplateView };
