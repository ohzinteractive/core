import UIElementState from '/UIElementState'

export default class OnMouseHover extends UIElementState
{
	constructor()
	{
		super();
	}

	on_enter(ui_element)
	{
		this.__trigger_on_hover(ui_element);
	}

	update(ui_element, normalized_mouse_position)
	{
		if(ui_element.is_mouse_over(normalized_mouse_position))
		{
			this.__trigger_on_hover(ui_element);
		}
		else
		{
			ui_element.set_state(ui_element._on_exit_state);
		}
	}

	__trigger_on_hover(ui_element)
	{
		if(ui_element.on_hover)
		{
			ui_element.on_hover();
		}
	}
}
