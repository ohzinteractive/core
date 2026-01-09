
class EasingFunctions
{
  constructor()
  {}

  static linear(x: any)
  {
    return x;
  }

  static triangular(x: any)
  {
    return 1 - Math.abs((x * 2) % (1 * 2) - 1);
  }

  static ease_in_sine(x: any)
  {
    return 1 - Math.cos(x * 3.1415926 / 2);
  }

  static ease_out_sine(x: any)
  {
    return Math.sin(x * 3.1415926 / 2);
  }

  static ease_in_out_sine(x: any)
  {
    return -(Math.cos(3.1415926 * x) - 1) / 2;
  }

  static ease_in_cubic(x: any)
  {
    return x * x * x;
  }

  static ease_out_cubic(x: any)
  {
    return 1 - Math.pow(1 - x, 3);
  }

  static ease_in_out_cubic(x: any)
  {
    return x < 0.5
      ? 4 * x * x * x
      : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  static ease_in_quad(x: any)
  {
    return x * x;
  }

  static ease_out_quad(x: any)
  {
    return 1 - (1 - x) * (1 - x);
  }

  static ease_in_out_quad(x: any)
  {
    return x < 0.5
      ? 2 * x * x
      : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }

  static ease_in_quart(x: any)
  {
    return x * x * x * x;
  }

  static ease_out_quart(x: any)
  {
    return 1 - Math.pow(1 - x, 4);
  }

  static ease_in_out_quart(x: any)
  {
    return x < 0.5
      ? 8 * x * x * x * x
      : 1 - Math.pow(-2 * x + 2, 4) / 2;
  }

  static ease_in_quint(x: any)
  {
    return x * x * x * x * x;
  }

  static ease_out_quint(x: any)
  {
    return 1 - Math.pow(1 - x, 5);
  }

  static ease_in_out_quint(x: any)
  {
    return x < 0.5
      ? 16 * x * x * x * x * x
      : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }

  static ease_in_expo(x: any)
  {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  }

  static ease_out_expo(x: any)
  {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  static ease_in_out_expo(x: any)
  {
    return x === 0
      ? 0
      : x === 1
        ? 1
        : x < 0.5
          ? Math.pow(2, 20 * x - 10) / 2
          : (2 - Math.pow(2, -20 * x + 10)) / 2;
  }

  static ease_in_circ(x: any)
  {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  }

  static ease_out_circ(x: any)
  {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }

  static ease_in_out_circ(x: any)
  {
    return x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }

  static ease_in_back(x: any)
  {
    return 2.7015 * x * x * x - 1.7015 * x * x;
  }

  static ease_out_back(x: any)
  {
    return 1 + 2.7015 * Math.pow(x - 1, 3) + 1.7015 * Math.pow(x - 1, 2);
  }

  static ease_in_out_back(x: any)
  {
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((2.5949095 + 1) * 2 * x - 2.5949095)) / 2
      : (Math.pow(2 * x - 2, 2) * ((2.5949095 + 1) * (x * 2 - 2) + 2.5949095) + 2) / 2;
  }

  static ease_in_elastic(x: any)
  {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
      ? 0
      : x === 1
        ? 1
        : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  }

  static ease_out_elastic(x: any)
  {
    return x === 0
      ? 0
      : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * 2.0943950) + 1;
  }

  static ease_in_out_elastic(x: any)
  {
    return x === 0
      ? 0
      : x === 1
        ? 1
        : x < 0.5
          ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * 1.3962633)) / 2
          : Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * 1.3962633) / 2 + 1;
  }

  static ease_in_bounce(x: any)
  {
    return 1 - this.ease_out_bounce(1 - x);
  }

  static ease_out_bounce(x: any)
  {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1)
    {
      return n1 * x * x;
    }
    else if (x < 2 / d1)
    {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    }
    else if (x < 2.5 / d1)
    {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    }
    else
    {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }

  static ease_in_out_bounce(x: any)
  {
    return x < 0.5
      ? (1 - this.ease_out_bounce(1 - 2 * x)) / 2
      : (1 + this.ease_out_bounce(2 * x - 1)) / 2;
  }

  static heartbeat(t: any)
  {
    return 1.0 - Math.pow(Math.abs(Math.sin(t + 1.0)), 63.0) * Math.sign(Math.sin(t)) * Math.sin(t + 1.5 + 1.0) * 0.8;
  }
}

/**
 * @typedef {'linear'|'triangular'|'ease_in_sine'|'ease_out_sine'|'ease_in_out_sine'|'ease_in_cubic'|'ease_out_cubic'|'ease_in_out_cubic'|'ease_in_quad'|'ease_out_quad'|'ease_in_out_quad'|'ease_in_quart'|'ease_out_quart'|'ease_in_out_quart'|'ease_in_quint'|'ease_out_quint'|'ease_in_out_quint'|'ease_in_expo'|'ease_out_expo'|'ease_in_out_expo'|'ease_in_circ'|'ease_out_circ'|'ease_in_out_circ'|'ease_in_back'|'ease_out_back'|'ease_in_out_back'|'ease_in_elastic'|'ease_out_elastic'|'ease_in_out_elastic'|'ease_in_bounce'|'ease_out_bounce'|'ease_in_out_bounce'|'heartbeat'} EasingFunctionType
 */

export { EasingFunctions };
