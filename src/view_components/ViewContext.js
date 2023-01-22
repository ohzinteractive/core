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

const view_context = new ViewContext();
export { view_context as ViewContext };
