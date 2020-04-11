import WorldImage from '../components/WorldImage';
import SimpleTextDrawer from '../canvas_drawer/SimpleTextDrawer';
import Capabilities from '../Capabilities';
import Debug from '../Debug';
export default class Text2D extends WorldImage
{
	constructor(text, font, color, pivot, is_static)
	{
		let simple_text_drawer = new SimpleTextDrawer(is_static);

		let draw_settings = {
        font: font,
        font_color: color || "#000000"
    };
		let canvas_texture = simple_text_drawer.draw_on_texture(text,draw_settings);

    canvas_texture.minFilter = THREE.LinearMipMapLinearFilter;
    canvas_texture.minFilter = THREE.LinearFilter;
    canvas_texture.needsUpdate = true;
    super(canvas_texture, pivot);

    this.simple_text_drawer = simple_text_drawer;
    this.canvas_texture = canvas_texture;
    this.draw_settings = draw_settings;

	}

	set text(value)
	{
		this.simple_text_drawer.draw_canvas(value, this.draw_settings);
		this.update_texture();
	}
}
