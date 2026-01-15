import { OMath } from '../utilities/OMath';
import { ActionInterpolator } from './ActionInterpolator';

class NumberInterpolator extends ActionInterpolator
{
  initial: boolean;

  constructor(attribute_name: string, from: number = 0, to: number = 1, initial: boolean = false, easing_function: string = 'linear')
  {
    super(easing_function);

    this.attribute_name = attribute_name;
    this.from = from;
    this.to = to;
    this.initial = initial;
  }

  update(context: any, t: number)
  {
    context[this.attribute_name] = OMath.lerp(this.from, this.to, this.easing_function(t));
  }

  evaluate(t: number)
  {
    return OMath.lerp(this.from, this.to, this.easing_function(t));
  }
}

export { NumberInterpolator };
