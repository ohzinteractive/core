export default class AbstractLoader
{
	constructor(resource_id, url)
	{
		this.progress = 0;
		this.resource_id = resource_id;
		this.url = url;

		this.has_finished = false;
		this.has_error = false;
		this.error_message = "none";
	}

	__update_progress(value)
	{
		this.progress = value;
	}
	__loading_ended()
	{
		this.has_finished = true;
	}
	__set_error(message)
	{
		this.has_error = true;
		this.error_message = message;
	}

	print_error()
	{
		console.error("Error while loading "+this.resource_id+"\n\t path: "+this.url+"\n\t\t"+this.error_message);
	}

	load(resource_container) {

	}
}
