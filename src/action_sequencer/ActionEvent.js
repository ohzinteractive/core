// @ts-check
class ActionEvent
{
  /**
   * @param {string} name
   * @param {string} method
   * @param {string} args
   */
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
