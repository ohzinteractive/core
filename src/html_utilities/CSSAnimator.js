import Animating from './css_animator_states/Animating';
import Idle from './css_animator_states/Idle';

export default class CSSAnimator
{
  constructor(element, css_property, from, to, value_suffix, duration, easing_function)
  {
    this.element = element;
    this.css_property = css_property;
    this.from = from;
    this.to = to;
    this.value_suffix = value_suffix;
    this.duration = duration;
    this.easing_function = easing_function;

    this.current_state = new Idle();
  }

  animate()
  {
    this.set_current_state(new Animating());
  }

  set_property_value(value)
  {
    this.element.style[this.css_property] = `${value}${this.value_suffix}`;
  }

  update()
  {
    this.current_state.update(this);
  }

  set_current_state(state)
  {
    this.current_state.on_exit(this);
    this.current_state = state;
    this.current_state.on_enter(this);
  }
}
