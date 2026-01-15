import { Vector3 } from 'three';
import { ActionInterpolator } from './ActionInterpolator';

class VectorInterpolator extends ActionInterpolator
{
  attribute_name: string;
  from: Vector3;
  to: Vector3;

  constructor(attribute_name: string, from = new Vector3(), to = new Vector3(1, 1, 1), easing_function = 'linear')
  {
    super(easing_function);

    this.attribute_name = attribute_name;
    this.from = from;
    this.to = to;
  }

  update(context: any, t: number)
  {
    const tmp = this.from.clone();
    tmp.lerp(this.to, this.easing_function(t));
    context[this.attribute_name].copy(tmp);
  }
}

export { VectorInterpolator };
