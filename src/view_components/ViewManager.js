import TransitionTable from './transition/TransitionTable';
import ViewStateTransitionHandler from './transition/ViewStateTransitionHandler';

class ViewManager
{
  constructor()
  {
    this.views = [];

    this.transition_table = new TransitionTable();
    this.transition_handler = new ViewStateTransitionHandler(this.transition_table);
  }

  update()
  {
    this.transition_handler.update();
  }

  go_to_view(view_name)
  {
    let v = this.get_view_by_name(view_name);
    this.transition_handler.go_to_state(v);
  }

  register_view(view)
  {
    this.views.push(view);
  }

  has_view(view_name)
  {
    for (let i = 0; i < this.views.length; i++)
    {
      if (this.views[i].name === view_name)
      {
        return true;
      }
    }
    return false;
  }

  add_transitions(transitions)
  {
    this.transition_table.add_transitions(transitions);
  }

  set_transitions(transitions)
  {
    this.transition_table.set_transitions(transitions);
  }

  set_view(view_name)
  {
    let view = this.get_view_by_name(view_name);

    this.transition_handler.set_state(view);
  }

  get_view_by_name(view_name)
  {
    for (let i = 0; i < this.views.length; i++)
    {
      if (this.views[i].name === view_name)
      {
        return this.views[i];
      }
    }
    console.error('get_view_by_name no view found for: ', view_name);
    return undefined;
  }

  set_initial_state_data(initial_state_data)
  {
    this.transition_table.set_initial_state_data(initial_state_data);
    this.transition_handler.set_initial_state_data(initial_state_data);
  }
}

export default new ViewManager();
