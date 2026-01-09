import { BaseState } from './BaseState';
import { OnRaycastHover } from './OnRaycastHover';
class OnRaycastEnter extends BaseState
{
  constructor()
  {
    super();
  }

  on_enter(context: any)
  {
    context.raycast_resolver.on_enter(context.current_intersections[0].object, context.current_intersections[0]);
    context.set_state(new OnRaycastHover());
  }
}

export { OnRaycastEnter };
