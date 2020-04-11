import AbstractLoader from '/resource_loader/AbstractLoader';

export default class JSONLoader extends AbstractLoader {
	constructor(resource_id, url, username, password) {
		super(resource_id, url);

		this.loader = new THREE.FileLoader();
		this.username = username;
		this.password = password;
		this.resource_container = undefined;
	}

	load(resource_container) {
		// let headers = new Headers();
		let headers = {};
		this.resource_container = resource_container;

		if (this.username !== undefined && this.password !== undefined) {
			headers['Authorization'] = `Basic ${btoa(`${this.username}:${this.password}`)}`
		}

		fetch(this.url, { headers: headers })
			.then(this.__parse_to_json.bind(this))
			.then(this.__set_resource.bind(this))
	}

	__parse_to_json(response) {
		return response.json();
	}

	__set_resource(data) {
		this.resource_container.set_resource(this.resource_id, data);

		this.__update_progress(1);
		this.__loading_ended();
	}

}
