import type { Vector3 } from 'three';
import { EasingFunctions } from '../utilities/EasingFunctions';

class ActionInterpolator
{
  attribute_name: string;
  easing_function: Function;
  from: number | Vector3;
  to: number | Vector3;

  constructor(easing_function = 'linear')
  {
    this.easing_function = undefined;

    if (typeof easing_function === 'string')
    {
      // @ts-expect-error -- IGNORE ---
      this.easing_function = EasingFunctions[easing_function];
    }
    else
    {
      this.easing_function = easing_function;
    }

    this.attribute_name = '';
    this.from = 0;
    this.to = 1;
  }

  update(context: any, t: number) 
  {
  }
}

export { ActionInterpolator };
