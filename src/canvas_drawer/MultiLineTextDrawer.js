import CanvasDrawer from '/CanvasDrawer';

export default class MultiLineTextDrawer extends CanvasDrawer{

  constructor ()
  {
    super();
    this.text_margin = new THREE.Vector2(2,0);
  }

  __draw (text_array, ctxOptions, canvas, ctx)
  {
    ctx.font = ctxOptions.font;
    let text_size = new THREE.Vector2();
    for(let i=0; i< text_array.length; i++)
    {
    	let new_size = this.get_text_size(text_array[i], ctxOptions.font);
    	console.log(new_size.clone());
    	text_size.x = Math.max(text_size.x , new_size.x);
			text_size.y += Math.max(text_size.y , new_size.y);
    }

    console.log("end draw", text_array.length, )

    canvas.width = Math.ceil(text_size.x+this.text_margin.x*2);
    canvas.height = Math.ceil(text_size.y/2+ this.text_margin.y*2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0,0, canvas.width, canvas.height);



    ctx.globalAlpha = 1;

    ctx.font = ctxOptions.font;
    ctx.fillStyle = ctxOptions.font_color;
    ctx.textBaseline = "middle";
    ctx.textAlignment = "left";

    let word_height = canvas.height/text_array.length;
    for(let i=0; i< text_array.length; i++)
    {
    	let height = i/(text_array.length);
    	ctx.fillText(text_array[i], this.text_margin.x/2, word_height * i + word_height/2);
    }
  }

}
