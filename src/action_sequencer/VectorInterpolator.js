import ActionInterpolator from './ActionInterpolator';

export default class VectorInterpolator extends ActionInterpolator
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
    let tmp = this.from.clone();
    tmp.lerp(this.to, this.easing_function(t));
    context[this.attribute_name].copy(tmp);
  }
}
