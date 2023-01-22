import { InputController } from 'pit-js';
import { KeyboardInput } from './KeyboardInput';

class Input extends InputController
{
  constructor()
  {
    super();

    this.clicked = false;
    this.captured_NDC = { x: 0, y: 0 };
    this.current_NDC_delta = { x: 0, y: 0 };

    this.keyboard = new KeyboardInput();
  }

  init(container, keyboard_input_container)
  {
    super.init(container);

    this.keyboard.init(keyboard_input_container);
  }

  dispose()
  {
    super.dispose();

    this.keyboard.dispose();
  }

  update()
  {
    if (this.left_mouse_button_pressed)
    {
      this.captured_NDC.x = this.NDC.x;
      this.captured_NDC.y = this.NDC.y;
    }

    if (this.left_mouse_button_down)
    {
      this.current_NDC_delta.x += Math.abs(this.NDC_delta.x);
      this.current_NDC_delta.y += Math.abs(this.NDC_delta.y);
    }

    if (this.left_mouse_button_released)
    {
      if (this.current_NDC_delta.x < 0.001 || this.current_NDC_delta.y < 0.001)
      {
        this.clicked = true;
      }

      this.current_NDC_delta = { x: 0, y: 0 };
    }
  }

  clear()
  {
    super.clear();

    this.clicked = false;

    this.keyboard.clear();
  }
}

const input = new Input();
export { input as Input };
