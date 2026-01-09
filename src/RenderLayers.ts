class RenderLayers
{
  constructor()
  {

  }

  static get opaque()
  {
    return 0;
  }

  static get transparent()
  {
    return 1;
  }

  static get outline()
  {
    return 2;
  }

  static get selectable()
  {
    return 3;
  }
}

export { RenderLayers };
