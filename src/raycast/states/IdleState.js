import { OnRaycastEnter } from './OnRaycastEnter';
import { BaseState } from './BaseState';
class IdleState extends BaseState
{
  constructor()
  {
    super();
  }

  update(context)
  {
    if (context.current_intersections.length > 0)
    {
      context.set_state(new OnRaycastEnter());
    }
  }
}

export { IdleState };
