// @ts-check
import { ActionInterpolator } from './ActionInterpolator';
import { OMath } from '../utilities/OMath';

class NumberInterpolator extends ActionInterpolator
{
  /**
   * @param {string} attribute_name
   * @param {number} [from]
   * @param {number} [to]
   * @param {boolean} [initial]
   * @param {import('../utilities/EasingFunctions').EasingFunctionType | function} [easing_function]
   */
  constructor(attribute_name, from = 0, to = 1, initial = false, easing_function = 'linear')
  {
    super(easing_function);

    this.attribute_name = attribute_name;
    this.from = from;
    this.to = to;
    this.initial = initial;
  }

  /**
   * @param {any} context
   * @param {number} t
   */
  update(context, t)
  {
    context[this.attribute_name] = OMath.lerp(this.from, this.to, this.easing_function(t));
  }

  /**
   * @param {number} t
   */
  evaluate(t)
  {
    return OMath.lerp(this.from, this.to, this.easing_function(t));
  }
}

export { NumberInterpolator };
