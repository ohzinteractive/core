import BaseState from './BaseState';
import IdleState from './IdleState';

export default class OnRaycastExit extends BaseState
{
  constructor()
  {
    super();
  }

  on_enter(context)
  {
    context.raycast_resolver.on_exit();
    context.set_state(new IdleState());
  }
}
