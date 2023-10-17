import { CommonView } from '../common/CommonView';
import { Sections, SectionsURLs } from '../Sections';

class TemplateView extends CommonView
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE,
      url: SectionsURLs.TEMPLATE,
      container: document.querySelector('.template')
    });
  }

  start()
  {
    super.start();
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
