// @ts-check
import { Vector3 } from 'three'; // eslint-disable-line no-unused-vars
import { EasingFunctions } from '../utilities/EasingFunctions';

class ActionInterpolator
{
  /**
   * @param {import('../utilities/EasingFunctions').EasingFunctionType | function} easing_function
   */
  constructor(easing_function = 'linear')
  {
    this.easing_function = undefined;

    if (typeof easing_function === 'string')
    {
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
  update(context, t) // eslint-disable-line no-unused-vars
  {
  }
}

export { ActionInterpolator };
