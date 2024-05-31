import { WorkerToMain } from '../view_components/WorkerToMain';

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
    WorkerToMain.push(`${this.name}.${this.method}`, this.args.split(','));
  }
}

export { ActionEvent };
