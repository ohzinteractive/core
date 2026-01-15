class ActionEvent
{
  args: string;
  method: string;
  name: string;
  
  constructor(name: string, method: string, args?: string)
  {
    this.name = name;
    this.method = method;
    this.args = args;
  }

  trigger()
  {
    // @ts-expect-error -- IGNORE ---
    ViewApi.application[this.name][this.method](...this.args.split(','));
  }
}

export { ActionEvent };
