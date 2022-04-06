import { InputController } from 'pit-js';
import KeyboardInput from './KeyboardInput';

class Input extends InputController
{
  constructor()
  {
    super();

    this.left_mouse_button_clicked = false;
    this.captured_NDC = { x: 0, y: 0 };

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

  clear()
  {
    super.clear();

    this.left_mouse_button_clicked = false;

    this.keyboard.clear();
  }
}

export default new Input();
