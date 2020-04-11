import EventManager from './EventManager';

class ResourceContainer
{
	constructor()
	{
		this.resources = {};
	}

	set_resource(name, resource)
	{
		this.resources[name] = resource;
		EventManager.fire_resource_loaded({name: name, value: resource});
	}

	get_resource(name)
	{
		return this.resources[name];
	}

}

const resource_container = new ResourceContainer();
module.exports = resource_container;
