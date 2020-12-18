import EasingFunctions from '../utilities/EasingFunctions';

export default class ActionInterpolator
{
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
  }

  update(context, t)
  {

  }
}
