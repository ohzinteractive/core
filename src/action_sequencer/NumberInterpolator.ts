import { OMath } from '../utilities/OMath';
import { ActionInterpolator } from './ActionInterpolator';

class NumberInterpolator extends ActionInterpolator
{
  initial: boolean;

  constructor(attribute_name: any, from: number = 0, to: number = 1, initial: boolean = false, easing_function: string = 'linear')
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
  update(context: any, t: any)
  {
    context[this.attribute_name] = OMath.lerp(this.from, this.to, this.easing_function(t));
  }

  /**
   * @param {number} t
   */
  evaluate(t: any)
  {
    return OMath.lerp(this.from, this.to, this.easing_function(t));
  }
}

export { NumberInterpolator };
