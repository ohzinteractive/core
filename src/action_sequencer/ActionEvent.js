import { ViewContext } from '../view_components/ViewContext';

class ActionEvent
{
  constructor(name, method, args)
  {
    this.name = name;
    this.method = method;
    this.args = args;
  }

  trigger()
  {
    ViewContext.app[this.name][this.method](...this.args.split(','));
  }
}

export { ActionEvent };
