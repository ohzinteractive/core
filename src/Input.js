import { InputController } from 'pit-js';

import KeyboardInput from './KeyboardInput';
class Input extends InputController
{
  constructor()
  {
    super();
    KeyboardInput.init(document.body);
    this.left_mouse_button_clicked = false;
    this.captured_NDC = { x: 0, y: 0 };
    this.keyboard = KeyboardInput;
  }

  clear()
  {
    super.clear();

    this.left_mouse_button_clicked = false;
    KeyboardInput.clear();
  }
}

export default new Input();
