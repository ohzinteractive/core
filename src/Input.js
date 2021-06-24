import { InputController } from 'pit-js';

class Input extends InputController
{
  constructor()
  {
    super();

    this.left_mouse_button_clicked = false;
    this.captured_NDC = { x: 0, y: 0 };
  }

  clear()
  {
    super.clear();

    this.left_mouse_button_clicked = false;
  }
}

export default new Input();
