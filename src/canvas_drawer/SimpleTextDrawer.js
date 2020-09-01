import CanvasDrawer from '/canvas_drawer/CanvasDrawer';

export default class SimpleTextDrawer extends CanvasDrawer{

  constructor ()
  {
    super();
    this.text_margin = new THREE.Vector2(2,0);
  }

  __draw (text, ctxOptions, canvas, ctx)
  {
    ctx.font = ctxOptions.font;

    let text_size = this.get_text_size(text, ctxOptions.font);
    // canvas.width = THREE.Math.ceilPowerOfTwo(text_size.x+this.text_margin.x*2);
    // canvas.height = THREE.Math.ceilPowerOfTwo(text_size.y+ this.text_margin.y*2);
    canvas.width = Math.ceil(text_size.x+this.text_margin.x*2);
    canvas.height = Math.ceil(text_size.y+ this.text_margin.y*2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // turn this on for debugging
    // ctx.globalAlpha = 0.2;
    // ctx.fillStyle = "#FF0000";
    // ctx.fillRect(0,0, canvas.width, canvas.height);



    ctx.globalAlpha = 1;

    ctx.font = ctxOptions.font;
    ctx.fillStyle = ctxOptions.font_color || "#000000";
    ctx.textBaseline = "middle";

    ctx.textAlign = ctxOptions.textAlign || "center";
    if(ctx.textAlign === "center")
      ctx.fillText(text, canvas.width/2, canvas.height/2);
    else
      ctx.fillText(text, 0, canvas.height / 2);
  }

}
