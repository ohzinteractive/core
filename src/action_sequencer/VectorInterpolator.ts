import { Vector3 } from 'three';
import { ActionInterpolator } from './ActionInterpolator';

class VectorInterpolator extends ActionInterpolator
{
  /**
   * @param {string} attribute_name
   * @param {Vector3} [from]
   * @param {Vector3} [to]
   * @param {import('../utilities/EasingFunctions').EasingFunctionType | function} [easing_function]
   */
  constructor(attribute_name: any, from = new Vector3(), to = new Vector3(1, 1, 1), easing_function = 'linear')
  {
    super(easing_function);

    this.attribute_name = attribute_name;
    this.from = from;
    this.to = to;
  }

  /**
   * @param {any} context
   * @param {number} t
   */
  update(context: any, t: any)
  {
    const tmp = this.from.clone();
    tmp.lerp(this.to, this.easing_function(t));
    context[this.attribute_name].copy(tmp);
  }
}

export { VectorInterpolator };
