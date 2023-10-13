
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
    ViewApi.application[this.name][this.method](...this.args.split(','));
  }
}

export { ActionEvent };
