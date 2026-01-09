import { BaseState } from './BaseState';
import { OnRaycastExit } from './OnRaycastExit';
class OnRaycastHover extends BaseState
{
  constructor()
  {
    super();
  }

  on_enter(context: any)
  {
  }

  update(context: any)
  {
    if (context.current_intersections.length > 0)
    {
      context.raycast_resolver.on_hover(context.current_intersections[0].object, context.current_intersections[0]);
    }
    else
    {
      context.set_state(new OnRaycastExit());
    }
  }
}

export { OnRaycastHover };
