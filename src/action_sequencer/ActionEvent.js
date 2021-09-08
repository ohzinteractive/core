import ViewContext from '../view_components/ViewContext';

export default class ActionEvent
{
  constructor(name, method)
  {
    this.name = name;
    this.method = method;
  }

  trigger()
  {
    ViewContext.properties[this.name][this.method]();
  }
}
