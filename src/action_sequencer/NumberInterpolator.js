import ActionInterpolator from './ActionInterpolator';
import { Math as TMath } from 'three';

export default class NumberInterpolator extends ActionInterpolator
{
  constructor(attribute_name, from = 0, to = 1, easing_function = 'linear')
  {
    super(easing_function);

    this.attribute_name = attribute_name;
    this.from = from;
    this.to = to;
  }

  update(context, t)
  {
    context[this.attribute_name] = TMath.lerp(this.from, this.to, this.easing_function(t));
  }
}
