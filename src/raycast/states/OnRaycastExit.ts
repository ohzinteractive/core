import type { GroupRaycaster } from '../GroupRaycaster';
import { BaseState } from './BaseState';
import { IdleState } from './IdleState';

class OnRaycastExit extends BaseState
{
  constructor()
  {
    super();
  }

  on_enter(context: GroupRaycaster)
  {
    context.raycast_resolver.on_exit();
    context.set_state(new IdleState());
  }
}

export { OnRaycastExit };
