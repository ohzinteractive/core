import { ViewContext } from '../view_components/ViewContext';

class ActionEvent
{
  constructor(name, method)
  {
    this.name = name;
    this.method = method;
  }

  trigger()
  {
    ViewContext.app[this.name][this.method]();
  }
}

export { ActionEvent };
