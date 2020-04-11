class CameraManager {
	constructor()
	{
		this._current = undefined;
	}

	set current(camera)
	{
		this._current = camera;
	}

	get current()
	{
		return this._current;
	}
}

const camera_manager = new CameraManager();
module.exports = camera_manager;
