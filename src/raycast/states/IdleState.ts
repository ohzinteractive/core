import type { GroupRaycaster } from '../GroupRaycaster';
import { BaseState } from './BaseState';
import { OnRaycastEnter } from './OnRaycastEnter';

class IdleState extends BaseState
{
  constructor()
  {
    super();
  }

  update(context: GroupRaycaster)
  {
    if (context.current_intersections.length > 0)
    {
      context.set_state(new OnRaycastEnter());
    }
  }
}

export { IdleState };
