import { Vector3 } from 'three';
import { EasingFunctions } from '../utilities/EasingFunctions';

class ActionInterpolator
{
  attribute_name: any;
  easing_function: any;
  from: any;
  to: any;

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
    /** @type {number | Vector3} */
    this.from = 0;
    /** @type {number | Vector3} */
    this.to = 1;
  }

  /**
   * @param {any} context
   * @param {number} t
   */
  update(context: any, t: any) 
  {
  }
}

export { ActionInterpolator };
