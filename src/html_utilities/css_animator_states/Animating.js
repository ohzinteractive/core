import Time from '../../Time';
import Idle from './Idle';

import { Math as TMath } from 'three';

export default class Animating
{
  constructor()
  {
    this.t = 0;
    this.easing_function_t = 0;
  }

  get is_animating()
  {
    return true;
  }

  on_enter(animator)
  {
  }

  update(animator)
  {
    this.t += Time.delta_time / animator.duration;

    this.easing_function_t = animator.easing_function(this.t);
    this.easing_function_t = TMath.clamp(this.easing_function_t, 0, 1);

    animator.set_property_value(TMath.lerp(animator.from, animator.to, this.easing_function_t));

    if (this.easing_function_t >= 0.9999)
    {
      animator.set_property_value(animator.to);
      animator.finished_callback(animator.element);
      animator.set_current_state(new Idle());
    }
  }

  on_exit(view)
  {

  }
}
