class ViewContext
{
  constructor()
  {
    this.properties = {};
  }

  add_property(name, p)
  {
    this.properties[name] = p;
  }
}

export default new ViewContext();
