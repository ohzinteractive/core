import UIElementState from './UIElementState'

export default class OnIdle extends UIElementState
{
	constructor()
	{
		super();
	}

	update(ui_element, normalized_mouse_position)
	{
		if(ui_element.is_mouse_over(normalized_mouse_position))
		{
			ui_element.set_state(ui_element._on_enter_state);
		}
	}
}