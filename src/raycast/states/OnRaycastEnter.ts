import type { GroupRaycaster } from '../GroupRaycaster';
import { BaseState } from './BaseState';
import { OnRaycastHover } from './OnRaycastHover';
class OnRaycastEnter extends BaseState
{
  constructor()
  {
    super();
  }

  on_enter(context: GroupRaycaster)
  {
    context.raycast_resolver.on_enter(context.current_intersections[0].point);
    context.set_state(new OnRaycastHover());
  }
}

export { OnRaycastEnter };
