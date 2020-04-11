import WorldImage from '/components/WorldImage';
import MultiLineTextDrawer from '/canvas_drawer/MultiLineTextDrawer';
import Capabilities from '/Capabilities';
import Debug from '/Debug';
import Text2D from '/Text2D';

export default class MultiLineText2D extends THREE.Object3D
{

	constructor(text_array, font, color, pivot, is_static)
	{
		super();

		font = font || "200px Arial";
		color = color || "#000000";
		pivot = pivot || new THREE.Vector2();

		this.text_array = [];

		for(let i=0; i< text_array.length; i++)
		{
			let text2D = new Text2D(text_array[i], font, color, pivot );
			this.text_array.push(text2D);
			this.add(text2D);
		}

		this.update_text_positions();


	}

	update_text_positions()
	{
		for(let i=0; i< this.text_array.length; i++)
		{
			this.text_array[i].position.y = -this.text_array[i].size.y * i;
		}
	}
	set texts(text_array)
	{
		for(let i=0; i< this.text_array.length; i++)
		{
			this.text_array[i].text = text_array[i];
		}
	}

	set size(value)
	{
		for(let i=0; i< this.text_array.length; i++)
		{
			this.text_array[i].size = value;
		}
		this.update_text_positions();
	}
}
