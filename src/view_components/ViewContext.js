class ViewContext
{
  constructor()
  {
    this.app = undefined;
  }

  set_app(app)
  {
    this.app = app;
  }
}

export default new ViewContext();
