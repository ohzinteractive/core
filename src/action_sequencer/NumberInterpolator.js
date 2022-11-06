import ActionInterpolator from './ActionInterpolator';
import OMath from '../utilities/OMath';

export default class NumberInterpolator extends ActionInterpolator
{
  constructor(attribute_name, from = 0, to = 1, initial = false, easing_function = 'linear')
  {
    super(easing_function);

    this.attribute_name = attribute_name;
    this.from = from;
    this.to = to;
    this.initial = initial;
  }

  update(context, t)
  {
    context[this.attribute_name] = OMath.lerp(this.from, this.to, this.easing_function(t));
  }

  evaluate(t)
  {
    return OMath.lerp(this.from, this.to, this.easing_function(t));
  }
}
